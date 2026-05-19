import Booking from "../model/BookModel.js";
import Listing from "../model/listModel.js";
import User from "../model/userModel.js";

export const cleanupExpiredBookings = async () => {
  const now = new Date();

  const expiredBookings = await Booking.find({
    $or: [
      { status: "booked", checkOut: { $lt: now } },
      {
        status: "pending_payment",
        createdAt: { $lt: new Date(now.getTime() - 60 * 60 * 1000) },
      },
    ],
  }).select("_id host guest listing");

  if (!expiredBookings.length) {
    return { cleanedCount: 0 };
  }

  const bookingIds = expiredBookings.map((booking) => booking._id);
  const listingIds = [
    ...new Set(expiredBookings.map((booking) => String(booking.listing))),
  ];
  const hostIds = [
    ...new Set(expiredBookings.map((booking) => String(booking.host))),
  ];
  const guestIds = [
    ...new Set(
      expiredBookings
        .map((booking) => booking.guest)
        .filter(Boolean)
        .map((id) => String(id)),
    ),
  ];

  if (listingIds.length) {
    for (const listingId of listingIds) {
      const remainingBooking = await Booking.findOne({
        listing: listingId,
        status: { $in: ["booked", "pending_payment"] },
        checkOut: { $gte: now },
      }).select("guest");

      await Listing.findByIdAndUpdate(listingId, {
        isBooked: !!remainingBooking,
        guest: remainingBooking ? remainingBooking.guest : null,
      });
    }
  }

  if (hostIds.length) {
    await User.updateMany(
      { _id: { $in: hostIds } },
      { $pull: { booking: { $in: bookingIds } } },
    );
  }

  if (guestIds.length) {
    await User.updateMany(
      { _id: { $in: guestIds } },
      { $pull: { booking: { $in: bookingIds } } },
    );
  }

  await Booking.deleteMany({ _id: { $in: bookingIds } });

  return { cleanedCount: bookingIds.length };
};
