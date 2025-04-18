// backend/routes/api/session.js
//EXPRESS IMPORTS
const express = require("express");
const { Op } = require("sequelize");
const bcrypt = require("bcryptjs");

//Security Imports
const { setTokenCookie, restoreUser } = require("../../utils/auth");
//Utilities
const { check } = require("express-validator");
const { handleValidationErrors } = require("../../utils/validation");

//Sequlize Imports
const { User } = require("../../db/models");

const router = express.Router();

//Protections for login data
const validateLogin = [
  check("credential")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Email or username is required"),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("Password is required"),
  handleValidationErrors,
];

router.post("/demo", async (req, res, next) => {
  try {
    const demoUser = await User.findOne({ where: { email: "demo@user.com" } });

    if (!demoUser) {
      return res.status(404).json({ message: "Demo user not found." });
    }

    await setTokenCookie(res, demoUser);

    return res.json({
      user: {
        id: demoUser.id,
        firstName: demoUser.firstName,
        lastName: demoUser.lastName,
        email: demoUser.email,
        username: demoUser.username,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Log in
router.post("/", validateLogin, async (req, res, next) => {
  try {
    const { credential, password } = req.body;

    const user = await User.unscoped().findOne({
      where: {
        [Op.or]: {
          username: credential,
          email: credential,
        },
      },
    });

    if (
      !user ||
      !bcrypt.compareSync(password, user.hashedPassword.toString())
    ) {
      const err = new Error("Invalid credentials");
      err.status = 401;
      err.title = "Login failed";
      err.errors = { credential: "The provided credentials were invalid." };
      return next(err);
    }

    const safeUser = {
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      username: user.username,
    };

    await setTokenCookie(res, safeUser);

    return res.status(200).json({
      user: safeUser,
    });
  } catch (error) {
    next(error);
  }
});

// Log out
router.delete("/", (_req, res, next) => {
  try {
    res.clearCookie("token");
    return res.json({ message: "success" });
  } catch (error) {
    next(error);
  }
});

// Restore session user
router.get("/", (req, res) => {
  try {
    const { user } = req;
    if (user) {
      const safeUser = {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        username: user.username,
      };
      return res.json({
        user: safeUser,
      });
    } else return res.json({ user: null });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
