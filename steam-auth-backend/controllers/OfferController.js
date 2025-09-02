const Offer = require("../models/Offer");

exports.sendOffer = async (req, res) => {
  const { toUser, offeredItems, requestedItems } = req.body;

  try {
    const offer = await Offer.create({
      fromUser: req.user._id,
      toUser,
      offeredItems,
      requestedItems,
    });

    res.json(offer);
  } catch (err) {
    res.status(500).json({ message: "Error sending offer" });
  }
};

exports.respondToOffer = async (req, res) => {
  const { id } = req.params;
  const { action } = req.body; // "accept" or "decline"

  try {
    const offer = await Offer.findById(id);

    if (!offer) return res.status(404).json({ message: "Offer not found" });
    if (offer.toUser.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not your offer" });
    }

    offer.status = action === "accept" ? "accepted" : "declined";
    await offer.save();

    res.json(offer);
  } catch (err) {
    res.status(500).json({ message: "Error responding to offer" });
  }
};

exports.getUserOffers = async (req, res) => {
  try {
    const offers = await Offer.find({
      $or: [{ fromUser: req.user._id }, { toUser: req.user._id }]
    })
    .populate("fromUser", "username avatar")
    .populate("toUser", "username avatar");

    res.json(offers);
  } catch (err) {
    res.status(500).json({ message: "Error fetching offers" });
  }
};
