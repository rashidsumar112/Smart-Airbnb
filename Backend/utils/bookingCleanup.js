import Booking from "../model/BookModel.js";
import Listing from "../model/listModel.js";
import User from "../model/userModel.js";

export const cleanupExpiredBookings = async () => {
  const now = new Date();

  const expiredBookings = await Booking.find({
    status: "booked",
    checkOut: { $lt: now },
  }).select("_id host guest listing");

  if (!expiredBookings.length) {
    return { cleanedCount: 0 };
  }

  const bookingIds = expiredBookings.map((booking) => booking._id);
  const listingIds = [...new Set(expiredBookings.map((booking) => String(booking.listing)))];
  const hostIds = [...new Set(expiredBookings.map((booking) => String(booking.host)))];
  const guestIds = [
    ...new Set(
      expiredBookings
        .map((booking) => booking.guest)
        .filter(Boolean)
        .map((id) => String(id))
    ),
  ];

  if (listingIds.length) {
    await Listing.updateMany(
      { _id: { $in: listingIds } },
      { $set: { isBooked: false, guest: null } }
    );
  }

  if (hostIds.length) {
    await User.updateMany(
      { _id: { $in: hostIds } },
      { $pull: { booking: { $in: bookingIds } } }
    );
  }

  if (guestIds.length) {
    await User.updateMany(
      { _id: { $in: guestIds } },
      { $pull: { booking: { $in: bookingIds } } }
    );
  }

  await Booking.deleteMany({ _id: { $in: bookingIds } });

  return { cleanedCount: bookingIds.length };
};
