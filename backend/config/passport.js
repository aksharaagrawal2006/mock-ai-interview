import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as GitHubStrategy } from "passport-github2";
import User from "../models/User.js";

// ---- Google OAuth ----
passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: process.env.GOOGLE_CALLBACK_URL,
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
          const email = profile.emails?.[0]?.value;
          // Link accounts if the same email already signed up another way
          user = email ? await User.findOne({ email }) : null;

          if (user) {
            user.googleId = profile.id;
          } else {
            user = new User({
              name: profile.displayName,
              email,
              avatar: profile.photos?.[0]?.value || "",
              provider: "google",
              googleId: profile.id,
            });
          }
        }

        user.lastLoginAt = new Date();
        await user.save();
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// ---- GitHub OAuth ----
passport.use(
  new GitHubStrategy(
    {
      clientID: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
      callbackURL: process.env.GITHUB_CALLBACK_URL,
      scope: ["user:email"],
    },
    async (_accessToken, _refreshToken, profile, done) => {
      try {
        let user = await User.findOne({ githubId: profile.id });

        if (!user) {
          const email =
            profile.emails?.[0]?.value || `${profile.username}@github.noemail`;
          user = await User.findOne({ email });

          if (user) {
            user.githubId = profile.id;
          } else {
            user = new User({
              name: profile.displayName || profile.username,
              email,
              avatar: profile.photos?.[0]?.value || "",
              provider: "github",
              githubId: profile.id,
            });
          }
        }

        user.lastLoginAt = new Date();
        await user.save();
        done(null, user);
      } catch (err) {
        done(err, null);
      }
    }
  )
);

// We use JWTs for session state, so no serialize/deserialize into cookies
// beyond what passport needs during the OAuth redirect handshake itself.
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (err) {
    done(err, null);
  }
});

export default passport;
