import jwt from "jsonwebtoken";
import { Vendor } from "../models/vendor.model.js";

export const protectVendorRoute = async (req, res, next) => {
  let token;

  if (
    req.headers.authorization &&
    req.hearders.authorization.startsWith("Bearer")
  ) {
    token = req.headers.authorization.split(" ")[1];
  } else if (
    typeof req.cookies.token !== "undefined" &&
    req.cookies.token !== null
  ) {
    token = req.cookies.token;
  }
  // Vérifier si le token existe
  if (!token) {
    return res
      .status(401)
      .json({ message: "Unauthorized - No token provided" });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const vendor = await Vendor.findById(decoded.vendor.id).select("-password");

    req.vendor = vendor;
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
