const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { users: memoryUsers, createId } = require("../config/memoryStore");

const isProduction = process.env.NODE_ENV === "production";
const isMemoryMode = () => process.env.USE_IN_MEMORY === "true";
const cookieMaxAgeSeconds = 60 * 60 * 24 * 7;

function getFrontendUrl() {
  return process.env.CLIENT_URL || "http://localhost:5173";
}

function getCallbackUrl() {
  return process.env.GOOGLE_CALLBACK_URL || "http://localhost:5000/auth/google/callback";
}

function cookieOptions(extra = []) {
  return [
    "Path=/",
    "HttpOnly",
    "SameSite=Lax",
    `Max-Age=${cookieMaxAgeSeconds}`,
    isProduction ? "Secure" : "",
    ...extra,
  ].filter(Boolean);
}

function setCookie(res, name, value, options = []) {
  res.append("Set-Cookie", `${name}=${encodeURIComponent(value)}; ${options.join("; ")}`);
}

function clearCookie(res, name, path = "/") {
  setCookie(res, name, "", [`Path=${path}`, "HttpOnly", "SameSite=Lax", "Max-Age=0", isProduction ? "Secure" : ""].filter(Boolean));
}

function getCookie(req, name) {
  const cookieHeader = req.headers.cookie || "";
  return cookieHeader
    .split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${name}=`))
    ?.slice(name.length + 1);
}

function publicUser(user) {
  return {
    id: String(user._id),
    name: user.name,
    email: user.email,
    profilePicture: user.profilePicture || "",
    googleId: user.googleId,
    balanceLimit: Number(user.balanceLimit ?? 1000),
  };
}

function signToken(user) {
  return jwt.sign({ userId: String(user._id) }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

async function findOrCreateGoogleUser(profile) {
  const email = profile.email?.toLowerCase();
  if (!email || !profile.sub) {
    throw new Error("Google account did not return a usable email/profile id.");
  }

  if (isMemoryMode()) {
    let user = memoryUsers.find((item) => item.googleId === profile.sub || item.email === email);
    if (!user) {
      user = {
        _id: createId(),
        name: profile.name || email.split("@")[0],
        email,
        googleId: profile.sub,
        profilePicture: profile.picture || "",
        authProvider: "google",
        balanceLimit: 1000,
        createdAt: new Date().toISOString(),
      };
      memoryUsers.push(user);
    } else {
      user.name = profile.name || user.name;
      user.googleId = profile.sub;
      user.profilePicture = profile.picture || user.profilePicture || "";
    }
    return user;
  }

  const update = {
    name: profile.name || email.split("@")[0],
    email,
    googleId: profile.sub,
    profilePicture: profile.picture || "",
    authProvider: "google",
  };

  return User.findOneAndUpdate(
    { $or: [{ googleId: profile.sub }, { email }] },
    { $set: update },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );
}

exports.startGoogleAuth = (req, res) => {
  const clientId = process.env.GOOGLE_CLIENT_ID;
  if (!clientId || !process.env.GOOGLE_CLIENT_SECRET) {
    return res.redirect(
      `${getFrontendUrl()}/auth?error=${encodeURIComponent(
        "Google sign-in needs GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in app/.env"
      )}`
    );
  }

  const state = crypto.randomBytes(24).toString("hex");
  setCookie(res, "oauth_state", state, [
    "Path=/auth/google/callback",
    "HttpOnly",
    "SameSite=Lax",
    "Max-Age=600",
    isProduction ? "Secure" : "",
  ].filter(Boolean));

  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: getCallbackUrl(),
    response_type: "code",
    scope: "openid email profile",
    state,
    prompt: "select_account",
  });

  return res.redirect(`https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`);
};

exports.handleGoogleCallback = async (req, res) => {
  const frontendUrl = getFrontendUrl();
  try {
    const { code, state } = req.query;
    const savedState = decodeURIComponent(getCookie(req, "oauth_state") || "");

    if (!code || !state || state !== savedState) {
      throw new Error("Google sign-in state could not be verified.");
    }

    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID,
        client_secret: process.env.GOOGLE_CLIENT_SECRET,
        redirect_uri: getCallbackUrl(),
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      throw new Error(tokenData.error_description || "Google token exchange failed.");
    }

    const profileResponse = await fetch("https://openidconnect.googleapis.com/v1/userinfo", {
      headers: { Authorization: `Bearer ${tokenData.access_token}` },
    });
    const profile = await profileResponse.json();
    if (!profileResponse.ok) {
      throw new Error(profile.error_description || "Could not load Google profile.");
    }

    const user = await findOrCreateGoogleUser(profile);
    const token = signToken(user);

    clearCookie(res, "oauth_state", "/auth/google/callback");
    setCookie(res, "auth_token", token, cookieOptions());
    return res.redirect(`${frontendUrl}/auth/callback`);
  } catch (error) {
    clearCookie(res, "oauth_state", "/auth/google/callback");
    return res.redirect(`${frontendUrl}/auth?error=${encodeURIComponent(error.message)}`);
  }
};

exports.getCurrentUser = async (req, res) => {
  return res.json({ user: publicUser(req.user) });
};

exports.updatePreferences = async (req, res) => {
  const balanceLimit = Number(req.body.balanceLimit);
  if (!Number.isFinite(balanceLimit) || balanceLimit < 0) {
    return res.status(400).json({ message: "Balance limit must be a positive number" });
  }

  if (isMemoryMode()) {
    req.user.balanceLimit = balanceLimit;
    return res.json({ user: publicUser(req.user) });
  }

  const user = await User.findByIdAndUpdate(
    req.userId,
    { $set: { balanceLimit } },
    { new: true }
  );
  return res.json({ user: publicUser(user) });
};

exports.logout = (req, res) => {
  clearCookie(res, "auth_token");
  return res.json({ message: "Logged out" });
};

exports.getAuthConfig = (req, res) => {
  return res.json({
    googleConfigured: Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET),
  });
};

exports.signup = (req, res) => {
  return res.status(410).json({ message: "Email signup is disabled. Continue with Google." });
};

exports.login = (req, res) => {
  return res.status(410).json({ message: "Password login is disabled. Continue with Google." });
};

exports.publicUser = publicUser;
