exports.logout = (req, res) => {
  req.logout(() => {
    req.session.destroy(() => res.sendStatus(200));
  });
};
