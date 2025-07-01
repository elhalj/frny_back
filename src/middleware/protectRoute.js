import jwt from "jsonwebtoken";
import { Vendor } from "../models/vendor.model.js";

export const protectVendorRoute = async (req, res, next) => {
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

    const vendor = await Vendor.findById(decoded.vendorId).select("-password");

    if (!vendor) {
      return res.status(404).json({ message: "Vendor not found" });
    }

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
