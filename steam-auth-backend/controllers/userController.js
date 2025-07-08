exports.getUser = (req, res) => {
  if (req.isAuthenticated()) {
    const { username, avatar, email, tradeUrl, steamId } = req.user;
    return res.json({ username, avatar, email, tradeUrl, steamId });
  }
  res.status(401).json({ message: "Not authenticated" });
};
