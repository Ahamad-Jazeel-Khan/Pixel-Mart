const Trade = require("../models/Trade");

exports.listItemsForTrade = async (req, res) => {
  const user = req.user; // Should be available via Passport session

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { items } = req.body;

  if (!items || !Array.isArray(items) || items.length === 0) {
    return res.status(400).json({ message: "No items provided" });
  }

  try {
    const tradeItems = items.map((item) => ({
      userId: user._id,
      steamId: user.steamId,
      item,
      listedAt: new Date(),
      isActive: true,
    }));

    await Trade.insertMany(tradeItems);

    res.status(200).json({ message: "Items listed for trade" });
  } catch (error) {
    console.error("Error listing trade items:", error);
    res.status(500).json({ message: "Server error" });
  }
};
exports.removeTradeItem = async (req, res) => {
  const user = req.user;

  if (!user) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { id } = req.params;

  try {
    const deleted = await Trade.findOneAndDelete({
      _id: id,
      userId: user._id,
    });

    if (!deleted) {
      return res.status(404).json({ message: "Item not found or not yours" });
    }

    res.status(200).json({ message: "Trade item removed" });
  } catch (err) {
    console.error("Error removing item:", err);
    res.status(500).json({ message: "Server error" });
  }
};
