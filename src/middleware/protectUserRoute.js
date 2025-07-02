import jwt from "jsonwebtoken";
import { User } from "../models/user.model.js";

export const protectRoute = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (
    typeof req.cookies.token !== "undefined" &&
    req.cookies.token !== null
  ) {
    token = req.cookies.token;
  }

  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const user = await User.findById(decoded.userId).select("-password");

    req.user = user;
    next();
  } catch (error) {
    if (error.name === "JsonWebTokenError") {
      return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }

    return res
      .status(500)
      .json({ message: "Internal Server Error", error: error.message });
  }
};
