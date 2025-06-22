import jwt from "jsonwebtoken";
import { Vendor } from "../models/vendor.model.js";

export const protectVendorRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unauthorized - No token provided" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const vendor = await Vendor.findById(decoded.userId).select("-password");
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
