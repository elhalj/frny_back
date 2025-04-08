import { Order } from "../models/commande.model.js";
import { Article } from "../models/article.model.js";
import { User } from "../models/user.model.js";
import { Vendor } from "../models/vendor.model.js";

export const OrderController = {
  // Créer une commande
  createOrder: async (req, res) => {
    try {
      const { articles } = req.body;
      const userId = req.user._id; // Supposant un middleware d'authentification

      // Vérification du stock et calcul du total
      let total = 0;
      const articlesToUpdate = [];

      for (const item of articles) {
        const article = await Article.findById(item.article);
        if (!article) {
          return res
            .status(404)
            .json({ message: `Article ${item.article} non trouvé` });
        }
        if (article.stock < item.quantity) {
          return res.status(400).json({
            message: `Stock insuffisant pour l'article ${article.name}`,
          });
        }
        total += article.price * item.quantity;
        articlesToUpdate.push({ article, quantity: item.quantity });
      }

      // Création de la commande
      const order = await Order.create({
        user: userId,
        articles: articles.map((item) => ({
          article: item.article,
          quantity: item.quantity,
        })),
        total,
        vendor: articlesToUpdate[0].article.vendor, // Supposant un seul vendeur par commande
      });

      // Mise à jour du stock
      for (const { article, quantity } of articlesToUpdate) {
        article.stock -= quantity;
        await article.save();
      }

      res.status(201).json(order);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la création de la commande" });
    }
  },

  // Récupérer les commandes d'un utilisateur
  getUserOrders: async (req, res) => {
    try {
      const orders = await Order.find({ user: req.user._id })
        .populate("user", "name email")
        .populate("articles.article", "name price")
        .populate("vendor", "name");
      res.json(orders);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des commandes" });
    }
  },

  // Récupérer les commandes d'un vendeur
  getVendorOrders: async (req, res) => {
    try {
      const vendorId = req.vendor._id; // Supposant un middleware vendeur
      const orders = await Order.find({ vendor: vendorId })
        .populate("user", "name email")
        .populate("articles.article", "name price");
      res.json(orders);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la récupération des commandes" });
    }
  },

  // Mettre à jour le statut d'une commande
  updateOrderStatus: async (req, res) => {
    try {
      const { status } = req.body;
      const order = await Order.findById(req.params.id);

      if (!order) {
        return res.status(404).json({ message: "Commande non trouvée" });
      }

      // Vérification des autorisations
      if (req.user.role === "vendor" && !order.vendor.equals(req.vendor._id)) {
        return res.status(403).json({ message: "Non autorisé" });
      }

      order.status = status;
      await order.save();
      res.json(order);
    } catch (error) {
      res
        .status(500)
        .json({ message: "Erreur lors de la mise à jour de la commande" });
    }
  },
};
