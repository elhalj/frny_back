import jwt from "jsonwebtoken";

export const generatedToken = (userId, res) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
    algorithm: "HS256",
  });

  res.cookie("token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    // sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    // secure: process.env.NODE_ENV === "production",
    // domain: process.env.NODE_ENV === "production" ? ".votre-domaine.com" : undefined,
  });

  return token;
};

export const generatedVendorToken = (vendorId, res) => {
  const token = jwt.sign({ vendorId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
    algorithm: "HS256",
  });

  res.cookie("token", token, {
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
    // sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
    // secure: process.env.NODE_ENV === "production",
    // domain: process.env.NODE_ENV === "production" ? ".votre-domaine.com" : undefined,
  });

  return token;
};
