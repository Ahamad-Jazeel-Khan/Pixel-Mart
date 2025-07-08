const passport = require("passport");
const SteamStrategy = require("passport-steam").Strategy;
const User = require("../models/User");

passport.serializeUser((user, done) => done(null, user.steamId));
passport.deserializeUser(async (steamId, done) => {
  try {
    const user = await User.findOne({ steamId });
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

passport.use(new SteamStrategy({
  returnURL: "http://localhost:4000/auth/steam/return",
  realm: "http://localhost:4000",
  apiKey: "4C4003ED1905C2E3622375F66D52AC87",
}, async (identifier, profile, done) => {
  try {
    const steamId = profile.id;
    const avatarUrl = profile.photos?.[2]?.value || profile.photos?.[0]?.value || "";
    let user = await User.findOne({ steamId });

    if (!user) {
      user = await User.create({
        steamId,
        username: profile.displayName,
        avatar: avatarUrl,
      });
    } else {
      user.username = profile.displayName;
      user.avatar = avatarUrl;
      await user.save();
    }

    done(null, user);
  } catch (err) {
    done(err);
  }
}));

module.exports = passport;
