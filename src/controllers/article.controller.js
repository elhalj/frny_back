import { Article } from "../models/article.model.js";
import { Vendor } from "../models/vendor.model.js";
import { generatedToken } from "../utils/createToken.js";

export const addArticle = async (req, res) => {
  const { name, price, details, category, stock, image } = req.body;
  try {
    if (!name || !price || !details || !category || !stock || !image) {
      return res
        .status(401)
        .json({ message: "Vous devez renseigner tous les champs" });
    }
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
    const article = await Article.create({
      name,
      price,
      details,
      category,
      stock,
      image: imageUrl || image,
      vendor: req.vendor._id,
    });

    const vendor = await Vendor.findById(req.vendor._id);
    if (!vendor) {
      console.log("Vendeur non trouver");
      return res.status(404).json({ message: "Vendeur non trouver" });
    }

    const responseData = {
      ...article.toObject(),
      vendor: {
        _id: vendor._id,
        name: vendor.name,
        email: vendor.email,
      },
    };

    res.status(201).json({
      message: "Article ajouté avec succès",
      data: responseData,
    });
  } catch (error) {
    console.log("ERROR server, can't add article", error.message);
    return res.status(500).json({ message: "ERROR server, can't add article" });
  }
};

export const getVendorArticle = async (req, res) => {
  try {
    const articles = await Article.find({ vendor: req.vendor._id })
      .populate("vendor", "name email")
      .sort({ createdAt: -1 });

    if (!articles.length) {
      return res
        .status(404)
        .json({ message: "Aucun article trouvé pour ce vendeur" });
    }

    const responseData = articles.map((article) => ({
      ...article.toObject(),
      vendor: {
        _id: article.vendor._id,
        name: article.vendor.name,
        email: article.vendor.email,
      },
    }));

    return res.status(200).json({
      message: "Articles du vendeur récupérés avec succès",
      data: responseData,
    });
  } catch (error) {
    console.error("Erreur serveur:", error.message);
    return res.status(500).json({ message: "Erreur serveur" });
  }
};

export const getArticle = async (req, res) => {
  try {
    const article = await Article.find({})
      .populate("vendor", "name")
      .sort({ createdAt: -1 });
    if (!article) {
      return res.status(401).json({ message: "Aucun article trouve" });
    }
    return res.status(200).json({ data: article });
  } catch (error) {
    console.log("ERROR server, can't get article", error.message);
    return res.status(500).json({ message: "ERROR server, can't get article" });
  }
};

export const updated = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(401).json({ message: "Article non trouve" });
    }

    if (article.vendor.toString() !== req.vendor._id.toString()) {
      return res.status(401).json({ message: "Non autorise a modifier" });
    }

    const updated = await Article.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
      },
      { new: true, runValidators: true }
    );
    return res
      .status(201)
      .json({ message: "Modifie avec succes", data: updated });
  } catch (error) {
    console.log("ERROR server, can't update", error.message);
    return res.status(500).json({ message: "ERROR server, can't update" });
  }
};

export const deleted = async (req, res) => {
  try {
    const article = await Article.findById(req.params.id);
    if (!article) {
      return res.status(401).json({ message: "Article non trouve" });
    }

    if (article.vendor.toString() !== req.vendor._id.toString()) {
      return res
        .status(401)
        .json({ message: "Vous n'avez pas l'autorisation de supprimer" });
    }

    await article.deleteOne({ _id: req.params.id });
    return res
      .status(201)
      .json({ message: "Supprimer avec succes", data: article });
  } catch (error) {
    console.log("ERROR server, can't delete", error.message);
    return res.status(500).json({ message: "ERROR server, can't delete" });
  }
};
