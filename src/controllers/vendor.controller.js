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
      !address ||
      !gender ||
      !profilePic
    ) {
      return res
        .status(400)
        .json({ message: "Vous devez renseigner tous les champs" });
    }

    const vendorExist = await Vendor.findOne({ email });
    if (vendorExist) {
      return res.status(409).json({ message: "cet email est deja utiliser" });
    }

    const hashPassword = await bcrypt.hash(password, 10);
    let imageUrl;
    if (image) {
      const uploadResponse = await cloudinary.uploader.upload(image);
      imageUrl = uploadResponse.secure_url;
    }

    const vendor = await Vendor.create({
      name,
      firstName,
      email,
      password: hashPassword,
      address,
      gender,
      profilePic: imageUrl,
    });

    if (vendor) {
      generatedToken(vendor._id, res);
      await vendor.save();
      return res.status(201).json({
        message: "Cree avec succes",
        data: {
          name: vendor.name,
          email: vendor.email,
          address: vendor.address,
        },
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
      return res.status(401).json({ message: "Utilisateur inextant" });
    }

    const verifyPassword = await bcrypt.compare(password, vendorExist.password);
    if (!verifyPassword) {
      return res
        .status(500)
        .json({ message: "Invalide password ou n'existe pas" });
    }

    generatedToken(vendorExist._id, res);
    return res.status(200).json({
      message: "Connecte avec succes",
      data: { name: vendorExist.name, email: vendorExist.email },
    });
  } catch (error) {
    console.log("ERROR, Internal server error", error.message);
    return res.status(401).json({ message: "Internal server ERROR" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    res.status(200).json({ message: "Deconnecte avec succes" });
  } catch (error) {
    console.log("ERROR server");
    return res.status(401).json({ message: "ERROR, Internal server " });
  }
};

export const checkAuth = async (req, res) => {
  try {
    if (!req.vendor) {
      return res.status(401).json({ message: "ERREUR authentification" });
    }

    return res.status(200).json(req.vendor);
  } catch (error) {
    console.log("ERROR, Internal server", error.message);
    return res.status(500).json({ message: "ERROR, CheckAuth. verify server" });
  }
};

// export const getClient = async (req, res) => {
//   try {
//     const clients = await Vendor.find({ client: req.user._id }).sort({
//       createdAt: -1,
//     });

//     if (!clients) {
//       return res.status(401).json({ message: "Pas de client" });
//     }

//     return res.status(201).json({ data: clients });
//   } catch (error) {
//     console.log("ERROR, Can't get client", error.message);
//     return res.status(500).json({ message: "ERROR server, Can't get client" });
//   }
// };
