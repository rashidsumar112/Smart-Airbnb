import Listing from "../model/listModel.js";
import Booking from "../model/BookModel.js";
import User from "../model/userModel.js";
import { cleanupExpiredBookings } from "../utils/bookingCleanup.js";
import Stripe from "stripe";

const getFrontendUrl = () =>
  process.env.FRONTEND_URL || "http://localhost:5173";
const getStripe = () => {
  const stripeSecretKey = process.env.STRIPE_SECRET_KEY?.trim();

  if (!stripeSecretKey) {
    throw new Error("STRIPE_SECRET_KEY is not configured");
  }

  return new Stripe(stripeSecretKey);
};

const calculateBookingTotals = (listingRent, checkIn, checkOut) => {
  const startDate = new Date(checkIn);
  const endDate = new Date(checkOut);
  const nights = (endDate - startDate) / (24 * 60 * 60 * 1000);
  const subtotal = listingRent * nights;
  const tax = subtotal * (7 / 100);
  const serviceFee = subtotal * (7 / 100);
  const totalRent = subtotal + tax + serviceFee;

  return {
    nights,
    subtotal,
    tax,
    serviceFee,
    totalRent,
  };
};

export const createBooking = async (req, res) => {
  try {
    await cleanupExpiredBookings();

    const { id } = req.params;
    const { checkIn, checkOut, totalRent, paymentMethod = "stripe" } = req.body;
    const startDate = new Date(checkIn);
    const endDate = new Date(checkOut);
    const frontend_url = getFrontendUrl();

    const listing = await Listing.findById(id);
    if (!listing) {
      return res.status(404).json({ message: "Listing is not found" });
    }

    if (startDate >= endDate) {
      return res.status(400).json({ message: "Invalid checkIn/checkOut date" });
    }

    const bookingTotals = calculateBookingTotals(
      listing.rent,
      checkIn,
      checkOut,
    );
    if (bookingTotals.nights <= 0) {
      return res
        .status(400)
        .json({ message: "Booking must be at least 1 night" });
    }

    const overlappingBooking = await Booking.findOne({
      listing: id,
      status: { $in: ["booked", "pending_payment"] },
      checkIn: { $lt: endDate },
      checkOut: { $gt: startDate },
    });

    if (overlappingBooking) {
      return res.status(409).json({
        message: "These dates are already booked",
        bookedRange: {
          checkIn: overlappingBooking.checkIn,
          checkOut: overlappingBooking.checkOut,
        },
      });
    }

    const booking = await Booking.create({
      checkIn,
      checkOut,
      totalRent: bookingTotals.totalRent,
      host: listing.host,
      guest: req.userId,
      listing: listing._id,
      status: paymentMethod === "cash" ? "booked" : "pending_payment",
      paymentStatus: paymentMethod === "cash" ? "cash" : "pending",
      paymentMethod,
    });

    if (paymentMethod === "cash") {
      await booking.populate("host", "email");
      await booking.populate("listing");

      await User.findByIdAndUpdate(req.userId, {
        $addToSet: { booking: booking._id },
      });

      await Listing.findByIdAndUpdate(listing._id, {
        guest: req.userId,
        isBooked: true,
      });

      return res.status(201).json({
        success: true,
        paymentMethod: "cash",
        booking,
      });
    }

    const stripe = getStripe();

    const line_items = [
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: `${listing.title} (${bookingTotals.nights} night${bookingTotals.nights > 1 ? "s" : ""})`,
          },
          unit_amount: Math.round(bookingTotals.subtotal * 100),
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: "Tax",
          },
          unit_amount: Math.round(bookingTotals.tax * 100),
        },
        quantity: 1,
      },
      {
        price_data: {
          currency: "inr",
          product_data: {
            name: "Service Fee",
          },
          unit_amount: Math.round(bookingTotals.serviceFee * 100),
        },
        quantity: 1,
      },
    ];

    const session = await stripe.checkout.sessions.create({
      line_items,
      mode: "payment",
      success_url: `${frontend_url}/verify?success=true&bookingId=${booking._id}&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${frontend_url}/verify?success=false&bookingId=${booking._id}&session_id={CHECKOUT_SESSION_ID}`,
      metadata: {
        bookingId: String(booking._id),
        listingId: String(listing._id),
        userId: String(req.userId),
      },
    });

    booking.stripeSessionId = session.id;
    await booking.save();

    return res.status(201).json({
      success: true,
      session_url: session.url,
      bookingId: booking._id,
      totalRent: bookingTotals.totalRent,
      requestedTotalRent: totalRent,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "booking error" });
  }
};

export const verifyBooking = async (req, res) => {
  const { bookingId, success, session_id } = req.body;

  try {
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res
        .status(404)
        .json({ success: false, message: "Booking not found" });
    }

    if (success !== "true") {
      await Booking.findByIdAndDelete(bookingId);
      return res
        .status(200)
        .json({ success: false, message: "Payment cancelled" });
    }

    if (!session_id) {
      return res
        .status(400)
        .json({ success: false, message: "Missing Stripe session id" });
    }

    const stripe = getStripe();
    const session = await stripe.checkout.sessions.retrieve(session_id);

    if (
      session.metadata?.bookingId &&
      session.metadata.bookingId !== String(bookingId)
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Session mismatch" });
    }

    if (session.payment_status !== "paid") {
      await Booking.findByIdAndDelete(bookingId);
      return res
        .status(400)
        .json({ success: false, message: "Payment not completed" });
    }

    const overlappingBooking = await Booking.findOne({
      _id: { $ne: bookingId },
      listing: booking.listing,
      status: "booked",
      checkIn: { $lt: booking.checkOut },
      checkOut: { $gt: booking.checkIn },
    });

    if (overlappingBooking) {
      await Booking.findByIdAndDelete(bookingId);
      return res
        .status(409)
        .json({
          success: false,
          message: "These dates are no longer available",
        });
    }

    booking.status = "booked";
    booking.paymentStatus = "paid";
    booking.stripeSessionId = session.id;
    booking.stripePaymentIntentId = session.payment_intent || "";
    await booking.save();

    await User.findByIdAndUpdate(booking.guest, {
      $addToSet: { booking: booking._id },
    });

    await Listing.findByIdAndUpdate(booking.listing, {
      guest: booking.guest,
      isBooked: true,
    });

    const populatedBooking = await Booking.findById(booking._id)
      .populate("host", "email")
      .populate("listing");

    return res.status(200).json({
      success: true,
      message: "Booking confirmed",
      booking: populatedBooking,
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ success: false, message: "Error" });
  }
};

export const cancleBooking = async (req, res) => {
  try {
    const { id } = req.params;

    let booking = await Booking.findById(id);
    if (!booking) {
      booking = await Booking.findOne({ listing: id });
    }

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (booking.status === "pending_payment") {
      await Booking.findByIdAndDelete(booking._id);
      return res
        .status(200)
        .json({ message: "Pending booking removed successfully" });
    }

    if (
      booking.host.toString() !== req.userId &&
      booking.guest.toString() !== req.userId
    ) {
      return res
        .status(403)
        .json({ message: "You are not authorized to cancel this booking" });
    }

    const isGuest = booking.guest.toString() === req.userId;
    const bookingCreatedTime = new Date(booking.createdAt).getTime();
    const currentTime = new Date().getTime();
    const timeDifference = currentTime - bookingCreatedTime;
    const oneHourInMilliseconds = 1 * 60 * 60 * 1000;

    if (isGuest && timeDifference > oneHourInMilliseconds) {
      return res.status(403).json({
        message:
          "Guests cannot cancel bookings after 1 hour of booking creation",
        hoursElapsed: Math.floor(timeDifference / (60 * 60 * 1000)),
      });
    }

    const remainingBooking = await Booking.findOne({
      listing: booking.listing,
      status: { $in: ["booked", "pending_payment"] },
      checkOut: { $gte: new Date() },
      _id: { $ne: booking._id },
    });

    const listing = await Listing.findByIdAndUpdate(
      booking.listing,
      {
        isBooked: !!remainingBooking,
        guest: remainingBooking ? remainingBooking.guest : null,
      },
      { new: true },
    );

    await User.findByIdAndUpdate(
      booking.host,
      { $pull: { booking: booking._id } },
      { new: true },
    );

    await User.findByIdAndUpdate(
      booking.guest,
      { $pull: { booking: booking._id } },
      { new: true },
    );

    await Booking.findByIdAndDelete(booking._id);

    if (!listing) {
      return res.status(400).json({ message: "Listing not found" });
    }

    return res
      .status(200)
      .json({
        message:
          "Booking Cancelled Successfully and removed from all collections",
      });
  } catch (error) {
    console.error("Cancel booking error:", error);
    return res.status(500).json({ message: "Error In Booking Cancelling" });
  }
};

export const getBookedDates = async (req, res) => {
  try {
    await cleanupExpiredBookings();

    const { id } = req.params;

    const bookings = await Booking.find({
      listing: id,
      status: { $in: ["booked", "pending_payment"] },
      checkOut: { $gte: new Date() },
    });

    const bookedDates = bookings.map((booking) => ({
      checkIn: booking.checkIn,
      checkOut: booking.checkOut,
      guest: booking.guest,
    }));

    return res.status(200).json(bookedDates);
  } catch (error) {
    console.log("Error fetching booked dates:", error);
    return res.status(500).json({ message: "Error fetching booked dates" });
  }
};
