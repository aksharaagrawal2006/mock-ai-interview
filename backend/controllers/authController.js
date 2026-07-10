import { sendTokenCookie } from "../utils/generateToken.js";


export const oauthCallback = (req, res) => {
  sendTokenCookie(res, req.user);
  res.redirect(`${process.env.CLIENT_URL}/dashboard`);
};

export const getMe = (req, res) => {
  res.json({ user: req.user });
};

export const logout = (req, res) => {
  res.clearCookie("token");
  res.json({ message: "Logged out" });
};
