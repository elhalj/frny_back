// import { User } from "../models/user.model";
import cloudinary from "../lib/cloudinary.js";
import { Vendor } from "../models/vendor.model.js";
import { generatedToken } from "../utils/createToken.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  const { name, firstName, email, password, address, gender, profilePic } =
    req.body;
  try {
    if (
      !name ||
      !firstName ||
      !email ||
      !password ||
      !gender ||
      !profilePic ||
      !address ||
      !city ||
      !municipality ||
      !number
    ) {
      return res
        .status(400)
        .json({ message: "Tous les champs sont obligatoires" });
    }

    const vendorExist = await Vendor.findOne({ email });
    if (vendorExist) {
      return res.status(409).json({ message: "Cet email est déjà utilisé" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    let imageUrl;
    if (profilePic) {
      const uploadResponse = await cloudinary.uploader.upload(profilePic);
      imageUrl = uploadResponse.secure_url;
    }

    const vendor = await Vendor.create({
      name,
      firstName,
      email,
      password: hashPassword,
      gender,
      profilePic: imageUrl,
      address,
      city,
      municipality,
      number,
    });

    if (vendor) {
      const token = generatedToken(vendor._id, res);
      await vendor.save();
      return res.status(201).json({
        message: "Créé avec succès",
        data: {
          name: vendor.name,
          email: vendor.email,
          address: vendor.address,
          articles: vendor.articles,
        },
        token,
      });
    }
  } catch (error) {
    console.log("ERROR, not signUp", error.message);
    return res.status(401).json({ message: "ERROR, Internal server error" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const vendorExist = await Vendor.findOne({ email });
    if (!vendorExist) {
      return res.status(401).json({ message: "Utilisateur inexistant" });
    }

    const verifyPassword = await bcrypt.compare(password, vendorExist.password);
    if (!verifyPassword) {
      return res.status(401).json({ message: "Mot de passe invalide" });
    }

    const token = generatedToken(vendorExist._id, res);
    return res.status(200).json({
      message: "Connecté avec succès",
      data: { name: vendorExist.name, email: vendorExist.email },
      token,
    });
  } catch (error) {
    console.log("ERROR, Internal server error", error.message);
    return res.status(401).json({ message: "ERROR, Internal server error" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Déconnecté avec succès" });
  } catch (error) {
    console.log("ERROR server", error.message);
    return res.status(401).json({ message: "ERROR, Internal server error" });
  }
};

export const checkAuth = async (req, res) => {
  try {
    const vendor = await Vendor.findById(req.vendor._id).select("-password");
    if (!vendor) {
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    }
    res
      .status(200)
      .json({ data: vendor, token: generatedToken(vendor._id, res) });
  } catch (error) {
    res.status(500).json({ message: "Erreur de vérification" });
  }
};
