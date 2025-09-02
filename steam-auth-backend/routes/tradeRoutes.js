const express = require("express");
const router = express.Router();
const { listItemsForTrade, removeTradeItem, getAllTradeItems,getUserTradeItems } = require("../controllers/TradeController");
const { sendOffer, respondToOffer, getUserOffers } = require("../controllers/OfferController");

const ensureAuth = (req, res, next) => {
  if (req.isAuthenticated && req.isAuthenticated()) return next();
  res.status(401).json({ message: "Not authenticated" });
};

router.post("/list", ensureAuth, listItemsForTrade);
router.post("/remove/:id", ensureAuth, removeTradeItem); // Change from delete to post
router.post("/all", ensureAuth, getAllTradeItems);
router.post("/offer/send", ensureAuth, sendOffer);
router.post("/offer/respond/:id", ensureAuth, respondToOffer);
router.get("/offers", ensureAuth, getUserOffers);
router.get("/my-items", ensureAuth, getUserTradeItems);

// ❌ Remove this — it’s confusing and not needed
// router.delete("/:id", removeTradeItem);

module.exports = router;
