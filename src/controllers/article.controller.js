import { Article } from "../models/article.model.js";

export const addArticle = async (req, res) => {
  const { name, price, details, category, stock, image, vendor } = req.body;
  try {
    if (
      !name ||
      !price ||
      !details ||
      !category ||
      !stock ||
      !image ||
      !vendor
    ) {
      return res
        .status(401)
        .json({ message: "Vous devez renseigner tous les champs" });
    }

    const article = await Article.create({
      name,
      price,
      details,
      category,
      stock,
      image,
      vendor: req.vendor._id,
    });

    // Formatage de la réponse avec les infos du vendeur
    const responseData = {
      ...article.toObject(),
      vendor: {
        _id: req.vendor._id,
        name: req.vendor.name,
        email: req.vendor.email,
        number: req.vendor.number,
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
    const article = await Article.find({ vendor: req.vendor._id })
      .populate("vendor", "name") // Ajouter cette ligne
      .sort({ createdAt: -1 });

    if (!article) {
      return res
        .status(401)
        .json({ message: "Aucun article trouve ou inexistant" });
    }

    return res.status(200).json({ data: article });
  } catch (error) {
    console.log("ERROR server, can't get article", error.message);
    return res.status(500).json({ message: "ERROR server, can't get article" });
  }
};

export const getArticle = async (req, res) => {
  try {
    const article = await Article.find({})
      .populate("vendor", "name") // Ajouter cette ligne
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
