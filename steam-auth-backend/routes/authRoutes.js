const express = require("express");
const passport = require("passport");
const { logout } = require("../controllers/authController");

const router = express.Router();

router.get("/steam", passport.authenticate("steam"));
router.get("/steam/return",
  passport.authenticate("steam", { failureRedirect: "/login-failed" }),
  (req, res) => res.redirect(process.env.FRONTEND_URL || "http://localhost:3000")
);
router.get("/logout", logout);

module.exports = router;
