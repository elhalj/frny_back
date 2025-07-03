import express from "express";
import { OrderController } from "../controllers/commandes.controller.js";
import { protectRoute } from "../middleware/protectUserRoute.js";
import { protectVendorRoute } from "../middleware/protectRoute.js";

const commandeRoutes = express.Router();

// Routes client
commandeRoutes.post("/user/create", protectRoute, OrderController.createOrder);
commandeRoutes.get("/user/get", protectRoute, OrderController.getUserOrders);

// Routes vendeur
commandeRoutes.get(
  "/vendor",
  protectVendorRoute,
  OrderController.getVendorOrders
);
commandeRoutes.patch(
  "/:id/status",
  protectVendorRoute,
  OrderController.updateOrderStatus
);

export default commandeRoutes;
