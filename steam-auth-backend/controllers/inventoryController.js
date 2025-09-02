const axios = require("axios");

exports.getInventory = async (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ message: "Not logged in" });
  }

  try {
    const steamId = "76561199206006029";
    if (!steamId) {
      return res.status(400).json({ message: "Steam ID is missing" });
    }

    const response = await axios.get(
      `https://steamcommunity.com/inventory/${steamId}/730/2`,
      {
        headers: {
          "User-Agent": "Mozilla/5.0",
          Accept: "application/json",
        },
      }
    );

    const data = response.data;

    if (!data?.success) {
      return res.status(500).json({ message: "Steam returned success: false" });
    }

    const { assets = [], descriptions = [] } = data;

    // Create a quick lookup map for descriptions
    const descMap = {};
    for (const desc of descriptions) {
      descMap[`${desc.classid}_${desc.instanceid}`] = desc;
    }

    const inventory = assets.map((item) => {
      const key = `${item.classid}_${item.instanceid}`;
      const desc = descMap[key];

      return {
        id: item.assetid,
        amount: item.amount,
        name: desc?.name,
        market_hash_name: desc?.market_hash_name,
        image: desc?.icon_url
          ? `https://steamcommunity-a.akamaihd.net/economy/image/${desc.icon_url}`
          : null,
      };
    });

    return res.status(200).json(inventory);
  } catch (err) {
    console.error("❌ Axios request failed:", err.message);
    if (err.response) {
      console.error("❌ Response data:", err.response.data);
      console.error("❌ Status code:", err.response.status);
    }
    return res.status(500).json({ message: "Failed to fetch inventory" });
  }
};
