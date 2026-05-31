# Expense Tracker (Unified Full Stack)

A single unified JavaScript full-stack expense tracker with authentication, dashboard analytics, and built-in ML-like category prediction.

## Project Structure

```text
FSWD/
├── app/
│   ├── server.js
│   ├── ml/
│   │   ├── model.js
│   │   └── classifier.js
│   ├── routes/
│   ├── controllers/
│   ├── models/
│   ├── middleware/
│   └── config/
├── client/
│   ├── index.html
│   ├── src/
│   └── package.json
├── package.json
└── README.md
```

## One-Command Run

From the `FSWD` root:

```bash
npm install
npm run dev
```

This runs both:
- Express server (`app/server.js`)
- React client (`client` via Vite)

Only one terminal is required.

## Environment Setup

Create `app/.env` from `app/.env.example`:

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/expense_tracker
JWT_SECRET=your_strong_secret_here
NODE_ENV=development
```

## API Endpoints

- `POST /auth/signup`
- `POST /auth/login`
- `GET /expenses` (protected)
- `POST /expenses` (protected)
- `PUT /expenses/:id` (protected)
- `DELETE /expenses/:id` (protected)
- `GET /summary` (protected)
- `POST /predict-category` (protected)

## ML Logic (Node.js)

The app uses a built-in JS classifier (`app/ml/classifier.js`) with keyword scoring to predict one of:
- `Food`
- `Travel`
- `Bills`
- `Shopping`
- `Others`

`predictCategory(description)` is used in:
- `POST /predict-category`
- automatic category fill while creating expenses if category is missing

## Tech Stack

- Frontend: React, Vite, Tailwind CSS, Framer Motion, Recharts
- Backend: Node.js, Express, MongoDB (Mongoose), JWT, bcrypt
- ML-like prediction: JavaScript keyword classifier (no Python required)
