const express = require("express");
const router = express.Router();
const { listItemsForTrade , removeTradeItem } = require("../controllers/TradeController");

// 🔐 Make sure user is authenticated
const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated()) return next();
  res.status(401).json({ message: "Not authenticated" });
};

router.post("/list", ensureAuth, listItemsForTrade);
router.delete("/remove/:id", ensureAuth, removeTradeItem);

module.exports = router;
