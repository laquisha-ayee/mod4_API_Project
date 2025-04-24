const express = require("express");
require("express-async-errors");

const morgan = require("morgan");
const cors = require("cors");
const csurf = require("csurf");
const helmet = require("helmet");

const cookieParser = require("cookie-parser");
const { environment } = require("./config");
const { ValidationError } = require("sequelize");

const isProduction = environment === "production";

const app = express();

app.use(morgan("dev"));
app.use(cookieParser());
app.use(express.json());

if (!isProduction) {
  app.use(cors());
}

app.use(
  helmet.crossOriginResourcePolicy({
    policy: "cross-origin",
  })
);

app.use(
  csurf({
    cookie: {
      secure: isProduction,
      sameSite: isProduction && "Lax",
      httpOnly: true,
    },
  })
);

// Routes
app.get("/", (req, res) => {
  res.json({ message: "Welcome to the API!" });
});

app.get("/api/protected-route", (req, res) => {
  res.json({ message: "This is a protected route!" });
});

app.get("/api/spots/:spotId/bookings", (req, res) => {
  const { spotId } = req.params;
  res.json({ message: `Bookings for spot ${spotId}` });
});

app.get("/api/spots/current", (req, res) => {
  res.json({ message: "Current spots route!" });
});

app.get("/api/spots/:spotId/images", (req, res) => {
  const { spotId } = req.params;
  res.json({ message: `Images for spot ${spotId}` });
});

// Error handling
app.use((_req, _res, next) => {
  const err = new Error("The requested resource couldn't be found.");
  err.title = "Resource Not Found";
  err.errors = { message: "The requested resource couldn't be found." };
  err.status = 404;
  next(err);
});

app.use((err, _req, _res, next) => {
  if (err instanceof ValidationError) {
    let errors = {};
    for (let error of err.errors) {
      errors[error.path] = error.message;
    }
    err.title = "Validation error";
    err.errors = errors;
  }
  next(err);
});

app.use((err, _req, res, _next) => {
  res.status(err.status || 500);
  console.error(err);
  res.json({
    message: err.message,
    errors: err.errors,
  });
});

module.exports = app;