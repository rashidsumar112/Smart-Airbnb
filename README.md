# MYProjectSmartAirBNB

SmartAirBNB — a simple Airbnb-style MERN project (React + Node/Express + MongoDB) with listing, booking, user auth, image upload, and a chatbot helper.

## Key features

- User authentication (signup / login)
- Create, edit and view listings (images via Cloudinary)
- Booking system with user bookings
- Chatbot endpoints for conversational assistance and nearby suggestions
- Image upload with multer + Cloudinary
- Stripe integration for payments (placeholders in code)

## Tech stack

- Frontend: React (Vite), Tailwind CSS
- Backend: Node.js, Express
- Database: MongoDB (Mongoose)
- Auth: JWT, cookie-based helpers
- File storage: Cloudinary
- Payments: Stripe

## Project structure (important folders)

```
MYProjectSmartAirBNB/
  Backend/           # Express API server
    controllers/
    routes/
    model/
    config/
    middleware/
  Frontend/          # React + Vite client
    src/
  README.md
  test.txt           # Simple test cases (manual or to convert to automated tests)
```

## Prerequisites

- Node.js (v18+ recommended)
- npm (v9+)
- MongoDB (local or Atlas)
- (Optional) Cloudinary account for image uploads
- (Optional) Stripe account for payments

## Environment variables

Create a `.env` file in `Backend/` with at least:

- MONGO_URI=<your-mongo-uri>
- JWT_SECRET=<your-jwt-secret>
- CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET
- STRIPE_SECRET_KEY (if using payments)

## Quick start

Backend (API)

```bash
cd Backend
npm install
# create .env as above
npm run dev
```

Frontend (client)

```bash
cd Frontend
npm install
npm run dev
```

Open the client at http://localhost:5173 (default Vite port) and API at http://localhost:6000 (or PORT in your `.env`).

## Testing notes

- See `test.txt` at project root: it contains simple test cases for signup, login, listings, booking, chatbot endpoints, and auth checks.
- If you want automated tests, I can add Jest + Supertest and example tests for key endpoints.

## How to contribute

- Fork the repo
- Create a branch for your feature
- Commit and open a PR

## Troubleshooting

- If server doesn't start: check `.env`, MongoDB connection, and that ports are free.
- File uploads failing: confirm Cloudinary keys and that `multer` middleware is configured.

If you want, I can convert `test.txt` into runnable Jest tests and wire a `test` script into `Backend/package.json`.

---

_Short and practical README tailored to this project's current structure. Let me know if you want it longer, translated, or with Docker instructions._
