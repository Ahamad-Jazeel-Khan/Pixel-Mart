const axios = require("axios");

exports.getInventory = async (req, res) => {
  if (!req.isAuthenticated || !req.isAuthenticated()) {
    return res.status(401).json({ message: "Not logged in" });
  }

try {

   const steamId = "76561199206006029"
  if (!steamId) return res.status(400).json({ message: "Steam ID is missing" });

 const sessionid =`99c57b448d9b0bc3bf4a419b`;
  const steamLoginSecure = `76561199206006029%7C%7CeyAidHlwIjogIkpXVCIsICJhbGciOiAiRWREU0EiIH0.eyAiaXNzIjogInI6MDAwN18yNkEzRDc0OV9CNTQ2QyIsICJzdWIiOiAiNzY1NjExOTkyMDYwMDYwMjkiLCAiYXVkIjogWyAid2ViOmNvbW11bml0eSIgXSwgImV4cCI6IDE3NTM2MDA5OTYsICJuYmYiOiAxNzQ0ODc0NDM3LCAiaWF0IjogMTc1MzUxNDQzNywgImp0aSI6ICIwMDAyXzI2QTlCM0NFXzg1OEMwIiwgIm9hdCI6IDE3NTMwODA3MzUsICJydF9leHAiOiAxNzcxMzYzMDE1LCAicGVyIjogMCwgImlwX3N1YmplY3QiOiAiMTA2LjIxOS42OC4xODYiLCAiaXBfY29uZmlybWVyIjogIjEwNi4yMTkuNjguMTg2IiB9.af57I-KIiqFB3fRlqd57BadQAI0WOlhgNIOmke7BUKlsIDDHsPRsEpcdwOfYfnC6GKRU66T6b5YJK5sz_lvPCg`

if (!sessionid || !steamLoginSecure) {
  return res.status(401).json({ message: "Missing Steam cookies" });
}


const response = await axios.get(
  `https://steamcommunity.com/profiles/${steamId}/inventory/json/730/2`,
  {
    headers: {
      'User-Agent': 'Mozilla/5.0',
      'Accept': 'application/json',
      'Referer': `https://steamcommunity.com/profiles/${steamId}/inventory/`,
      'Cookie': `sessionid=${sessionid}; steamLoginSecure=${steamLoginSecure}`
    }
  }
);

const data = response.data;


  if (!data?.success) {
    return res.status(500).json({ message: "Steam returned success: false" });
  }

  // const items = data.rgInventory;
const descriptions = data.rgDescriptions;
const inventory = Object.values(data.rgInventory).map(item => {
  const key = `${item.classid}_${item.instanceid}`;
  const desc = descriptions[key];

  return {
    id: item.id,
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
  console.error("❌ Error stack:", err.stack);
  if (err.response) {
    console.error("❌ Response data:", err.response.data);
    console.error("❌ Status code:", err.response.status);
  }
  return res.status(500).json({ message: "Failed to fetch inventory" });
}
};