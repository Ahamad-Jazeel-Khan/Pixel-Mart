const axios = require("axios");

// Configure your Steam Web API key
const STEAM_WEB_API_KEY = '4C4003ED1905C2E3622375F66D52AC87'; // Get from https://steamcommunity.com/dev/apikey

exports.getInventory = async (req, res) => {
  // Debug logging
  console.log("🔍 [Debug] Session ID:", req.sessionID);
  console.log("🔍 [Debug] User Object:", JSON.stringify(req.user, null, 2));
  
  // Authentication check
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    console.warn("⚠️ User not authenticated");
    return res.status(401).json({ message: "Not logged in" });
  }

  try {
    const steamId = req.user?.steamId;
    if (!steamId) {
      console.error("❌ No Steam ID found");
      return res.status(400).json({ message: "Steam ID is missing" });
    }

    console.log("🆔 Fetching inventory for SteamID:", steamId);

    // First try: Steam Web API (more reliable)
    try {
      const webApiUrl = `https://api.steampowered.com/IEconItems_730/GetPlayerItems/v1/?key=${STEAM_WEB_API_KEY}&steamid=${steamId}`;
      console.log("🔗 Trying Steam Web API:", webApiUrl);

      const webApiResponse = await axios.get(webApiUrl, {
        timeout: 15000,
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });

      if (webApiResponse.data?.result?.items) {
        console.log("✅ Steam Web API success. Items:", webApiResponse.data.result.items.length);
        
        // Format to match community API structure
        const formatted = {
          assets: webApiResponse.data.result.items.map(item => ({
            assetid: item.id,
            classid: item.classid,
            instanceid: item.instanceid,
            amount: item.amount.toString()
          })),
          descriptions: webApiResponse.data.result.items.map(item => ({
            classid: item.classid,
            instanceid: item.instanceid,
            market_name: item.market_name,
            market_hash_name: item.market_hash_name,
            icon_url: item.icon_url,
            icon_url_large: item.icon_url_large
          })),
          total_inventory_count: webApiResponse.data.result.items.length
        };

        return res.status(200).json(formatted);
      }
    } catch (webApiError) {
      console.warn("⚠️ Steam Web API failed, falling back to Community API");
    }

    // Fallback: Steam Community API
    const communityUrl = `https://steamcommunity.com/inventory/${steamId}/730/2?l=english&count=5000`;
    console.log("🔗 Trying Steam Community API:", communityUrl);

    const communityResponse = await axios.get(communityUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36',
        'Cookie': req.headers.cookie || '',
        'Accept-Language': 'en-US,en;q=0.9'
      },
      timeout: 30000
    });

    if (!communityResponse.data || communityResponse.data.success !== 1) {
      throw new Error("Steam returned empty or invalid inventory");
    }

    console.log("✅ Community API success. Items:", communityResponse.data.assets?.length || 0);
    return res.status(200).json(communityResponse.data);

  } catch (err) {
    console.error("❌ Final Error:", err.message);
    console.error("❌ Error Details:", err.response?.data || err.stack);

    if (err.code === 'ECONNABORTED') {
      return res.status(504).json({ 
        message: "Steam servers took too long to respond",
        solution: "Try again later or use a VPN"
      });
    }

    return res.status(500).json({
      message: "Failed to fetch inventory from all available sources",
      error: err.message,
      details: err.response?.data || null
    });
  }
};