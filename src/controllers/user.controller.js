import { User } from "../models/user.model.js";
import { generatedToken } from "../utils/createToken.js";
import bcrypt from "bcryptjs";

export const signUp = async (req, res) => {
  const { name, firstName, email, password, address } = req.body;
  try {
    if (!name || !firstName || !email || !password || !address) {
      return res
        .status(401)
        .json({ message: "Vous devez renseigner tous les champs" });
    }

    const userExist = await User.findOne({ email: email });
    if (userExist) {
      return res.status(409).json({
        message: "L'email exist deja, veuillez renseigner un email valide",
      });
    }

    const hashPassword = await bcrypt.hash(password, 12);
    const user = await User.create({
      ...req.body,
      password: hashPassword,
    });

    if (user) {
      generatedToken(user._id, res);
      await user.save();
      return res.status(201).json({
        message: "Enregistre avec succes",
        data: { name: user.name, email: user.email },
      });
    }
  } catch (error) {
    console.log("ERROR, Can't signUp", error.message);
    return res
      .status(500)
      .json({ message: "ERROR server, Internal server error" });
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
    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).json({ message: "Utilisateur inexistant" });
    }

    const verifyPassword = await bcrypt.compare(password, user.password);
    if (!verifyPassword) {
      return res
        .status(401)
        .json({ message: "Erreur mot de passe ou n'existe pas" });
    }
    generatedToken(user._id, res);
    return res.status(200).json({
      message: "connete avec succes",
      data: { name: user.name, email: user.email },
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
    if (!req.user) {
      return res.status(401).json({ message: "Erreur d'authentification" });
    }
    return res.status(200).json(req.user);
  } catch (error) {
    console.log("ERROR Authentificate", error.message);
    return res
      .status(500)
      .json({ message: "ERROR server, can't authentificate" });
  }
};

export const getMyArticle = async (req, res) => {
  try {
    const myArticle = await User.find(req.article._id).sort({ createdAt: -1 });
    if (!myArticle) {
      return res.status(401).json({ message: "Aucun article" });
    }

    return res.status(200).json({ data: myArticle });
  } catch (error) {
    console.log("ERROR server", error.message);
    return res.status(500).json({ message: "ERROR server, can't get article" });
  }
};
