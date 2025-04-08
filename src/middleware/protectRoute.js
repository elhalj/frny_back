import jwt from "jsonwebtoken";
import { Vendor } from "../models/vendor.model.js";

export const protectVendorRoute = async (req, res, next) => {
  try {
    const token = req.cookies.jwt;
    if (!token) {
      return res
        .status(401)
        .json({ message: "Unhautorize - No token provider" });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    const vendor = await Vendor.findById(decoded.userId).select("-password");
    if (!vendor) {
      return res.status(401).json({ message: "Vendor not found" });
    }

    req.vendor = vendor;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ message: "ERROR, internal server", error: error.message });
  }
};
