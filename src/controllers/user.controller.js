import cloudinary from "../lib/cloudinary.js";
import { User } from "../models/user.model.js";
import { generatedToken } from "../utils/createToken.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  const {
    name,
    firstName,
    email,
    password,
    address,
    city,
    municipality,
    street,
  } = req.body;
  try {
    // if (
    //   !name ||
    //   !firstName ||
    //   !email ||
    //   !password ||
    //   !address ||
    //   !city ||
    //   !municipality ||
    //   !street
    // ) {
    //   return res
    //     .status(400)
    //     .json({ message: "Vous devez renseigner tous les champs" });
    // }

    const userExist = await User.findOne({ email });
    if (userExist) {
      return res.status(409).json({
        message: "L'email existe deja, veuillez renseigner un email valide",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    let imageUrl;
    if (req.file) {
      try {
        const uploadResponse = await cloudinary.uploader.upload(req.file.path);
        imageUrl = uploadResponse.secure_url;
      } catch (err) {
        return res.status(502).json({
          message: "Erreur lors du téléchargement de l'image sur Cloudinary.",
          error: err.message || err.toString(),
        });
      }
    }
    const user = await User.create({
      name,
      firstName,
      email,
      password: hashPassword,
      address,
      city,
      municipality,
      street,
      image: imageUrl,
    });

    if (user) {
      const token = generatedToken(user._id, res);
      await user.save();
      return res.status(201).json({
        message: "Enregistre avec succes",
        data: { name: user.name, email: user.email },
        token,
      });
    }
  } catch (error) {
    console.log("ERROR, Can't signUp", error.message);
    return res.status(500).json({
      message: "ERROR server, Internal server error",
      message: "ERROR server, Internal server error" + error.message,
    });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    if (!email || !password) {
      return res
        .status(401)
        .json({ message: "Vous devez renseigner tous les champs" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(401).json({ message: "Utilisateur inexistant" });
    }

    const verifyPassword = await bcrypt.compare(password, user.password);
    if (!verifyPassword) {
      return res
        .status(401)
        .json({ message: "Erreur mot de passe ou n'existe pas" });
    }
    const token = generatedToken(user._id, res);
    return res.status(200).json({
      message: "connete avec succes",
      data: { name: user.name, email: user.email },
      token,
    });
  } catch (error) {
    console.log("ERROR server, can't connect", error.message);
    return res.status(500).json({ message: "ERROR server, can't connect" });
  }
};

export const logout = (req, res) => {
  try {
    res.cookie("jwt", "", { maxAge: 0 });
    return res.status(201).json({ message: "Deconnecte avec succes" });
  } catch (error) {
    console.log("ERROR server", error.message);
    return res.status(500).json({ message: "ERROR server" });
  }
};

export const checkAuthUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user)
      return res.status(404).json({ message: "Utilisateur non trouvé" });
    res.status(200).json(user);
  } catch (error) {
    res.status(500).json({ message: "Erreur de vérification" });
  }
};

export const getMyArticle = async (req, res) => {
  try {
    const myArticle = await User.findById(req.user._id)
      .populate({
        path: "articles",
        options: { sort: { createdAt: -1 } },
      })
      .select("-password");
    if (!myArticle) {
      return res.status(401).json({ message: "Aucun article" });
    }

    return res.status(200).json({ data: myArticle.articles });
  } catch (error) {
    console.log("ERROR server", error.message);
    return res.status(500).json({ message: "ERROR server, can't get article" });
  }
};
