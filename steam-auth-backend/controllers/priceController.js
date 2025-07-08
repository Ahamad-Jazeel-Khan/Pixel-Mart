const axios = require("axios");
const priceCache = new Map();

exports.getPrice = async (req, res) => {
  const { marketHashName } = req.params;

  if (priceCache.has(marketHashName)) {
    const cached = priceCache.get(marketHashName);
    const isExpired = Date.now() - cached.timestamp > 5 * 60 * 1000;
    if (!isExpired) {
      return res.json(cached.data);
    }
  }

  try {
    const response = await axios.get("https://steamcommunity.com/market/priceoverview/", {
      params: {
        appid: 730,
        currency: 1,
        market_hash_name: marketHashName,
      },
    });

    const data = response.data.success
      ? {
          success: true,
          lowest_price: response.data.lowest_price,
          median_price: response.data.median_price,
        }
      : { success: false, message: "Price not available" };

    priceCache.set(marketHashName, { data, timestamp: Date.now() });

    res.json(data);
  } catch (err) {
    console.error("❌ Price API error:", err.response?.data || err.message);
    res.status(500).json({ success: false, message: "Failed to fetch price" });
  }
};
