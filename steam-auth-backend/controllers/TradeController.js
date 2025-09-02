const Trade = require("../models/Trade");

// List items for trade
exports.listItemsForTrade = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { items } = req.body;
    
    // Validate items array
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "No valid items provided" });
    }

    // Validate each item structure
    const invalidItems = items.filter(item => 
      !item || !item.id || !item.market_hash_name
    );
    
    if (invalidItems.length > 0) {
      return res.status(400).json({ 
        message: "Some items are missing required fields (id, market_hash_name)",
        invalidItems 
      });
    }

    // Check for duplicate items in the request
    const itemIds = items.map(item => item.id);
    const duplicateIds = itemIds.filter((id, index) => itemIds.indexOf(id) !== index);
    if (duplicateIds.length > 0) {
      return res.status(400).json({ 
        message: "Duplicate items in request", 
        duplicateIds 
      });
    }

    // Check if items already exist in active trades
    const existingTrades = await Trade.find({
      userId: user._id,
      'item.id': { $in: itemIds },
      isActive: true
    });

    if (existingTrades.length > 0) {
      const existingIds = existingTrades.map(trade => trade.item.id);
      return res.status(409).json({ 
        message: "Some items are already listed for trade",
        existingItems: existingIds 
      });
    }

    // Create trade items
    const tradeItems = items.map((item) => ({
      userId: user._id,
      steamId: user.steamId,
      username: user.username,
      item: {
        id: item.id,
        assetid: item.assetid || item.id,
        classid: item.classid,
        instanceid: item.instanceid,
        market_hash_name: item.market_hash_name,
        name: item.name || item.market_hash_name,
        image: item.image,
        icon_url: item.icon_url
      },
      listedAt: new Date(),
      isActive: true,
    }));

    const savedItems = await Trade.insertMany(tradeItems);

    res.status(201).json({
      message: "Items listed for trade successfully",
      count: savedItems.length,
      items: savedItems,
    });
  } catch (error) {
    console.error("Error listing trade items:", error);
    res.status(500).json({ 
      message: "Server error while processing trade items",
      error: error.message 
    });
  }
};

// Remove trade item
exports.removeTradeItem = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { id } = req.params;

    // Validate ID format
    if (!id || id.length !== 24) {
      return res.status(400).json({ message: "Invalid item ID format" });
    }

    const tradeItem = await Trade.findById(id);
    if (!tradeItem) {
      return res.status(404).json({ message: "Trade item not found" });
    }

    // Ownership check
    if (tradeItem.userId.toString() !== user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to remove this item" });
    }

    // Actually delete from database
    await Trade.findByIdAndDelete(id);

    res.status(200).json({ 
      message: "Trade item removed successfully", 
      id: tradeItem._id,
      item: tradeItem.item 
    });
  } catch (err) {
    console.error("❌ Error removing trade item:", err);
    
    if (err.name === 'CastError') {
      return res.status(400).json({ message: "Invalid item ID format" });
    }
    
    res.status(500).json({ 
      message: "Server error while removing trade item",
      error: err.message 
    });
  }
};

// Get all active trade items
exports.getAllTradeItems = async (req, res) => {
  try {
    const { page = 1, limit = 50, search } = req.query;
    
    const query = { isActive: true };
    
    // Add search functionality
    if (search) {
      query.$or = [
        { 'item.market_hash_name': { $regex: search, $options: 'i' } },
        { 'item.name': { $regex: search, $options: 'i' } },
        { username: { $regex: search, $options: 'i' } }
      ];
    }

    const options = {
      page: parseInt(page),
      limit: parseInt(limit),
      sort: { listedAt: -1 }
    };

    const trades = await Trade.paginate(query, options);

    res.json({
      message: "Trade items retrieved successfully",
      totalItems: trades.totalDocs,
      totalPages: trades.totalPages,
      currentPage: trades.page,
      items: trades.docs
    });
  } catch (err) {
    console.error("Error fetching trade items:", err);
    res.status(500).json({ 
      message: "Error fetching trade items",
      error: err.message 
    });
  }
};

// Get user's active trade items
exports.getUserTradeItems = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const items = await Trade.find({ 
      userId: user._id, 
      isActive: true 
    }).sort({ listedAt: -1 });

    res.json({
      message: "User trade items retrieved successfully",
      count: items.length,
      items
    });
  } catch (err) {
    console.error("Error fetching user trade items:", err);
    res.status(500).json({ 
      message: "Error fetching user trade items",
      error: err.message 
    });
  }
};

// Bulk remove trade items
exports.bulkRemoveTradeItems = async (req, res) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const { itemIds } = req.body;
    
    if (!itemIds || !Array.isArray(itemIds) || itemIds.length === 0) {
      return res.status(400).json({ message: "No item IDs provided" });
    }

    const result = await Trade.updateMany(
      {
        _id: { $in: itemIds },
        userId: user._id
      },
      {
        isActive: false,
        removedAt: new Date()
      }
    );
    // Get user's active trade items
    exports.getUserTradeItems = async (req, res) => {
      try {
        const user = req.user;
        if (!user) {
          return res.status(401).json({ message: "Unauthorized" });
        }

        const items = await Trade.find({ 
          userId: user._id, 
          isActive: true 
        }).sort({ listedAt: -1 });

        res.json({
          message: "User trade items retrieved successfully",
          count: items.length,
          items
        });
      } catch (err) {
        console.error("Error fetching user trade items:", err);
        res.status(500).json({ 
          message: "Error fetching user trade items",
          error: err.message 
        });
      }
    };

    res.json({
      message: "Items removed from trade successfully",
      modifiedCount: result.modifiedCount
    });
  } catch (err) {
    console.error("Error in bulk remove:", err);
    res.status(500).json({ 
      message: "Error removing items",
      error: err.message 
    });
  }
};