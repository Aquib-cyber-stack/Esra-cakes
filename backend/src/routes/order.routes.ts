import { Router } from "express";
import {
  createOrder,
  trackOrder,
  listOrders,
  getOrder,
  updateOrderStatus,
  setOrderQuote,
  addOrderNote,
  dashboardStats,
} from "../controllers/order.controller";
import { requireAdmin } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { orderSchema, orderStatusSchema, orderQuoteSchema, orderNoteSchema } from "../utils/schemas";
import { upload } from "../middleware/upload";

const router = Router();

// Public
router.post("/", upload.array("referenceImages", 4), validateBody(orderSchema), createOrder);
router.get("/track/:reference", trackOrder);

// Admin
router.get("/dashboard/stats", requireAdmin, dashboardStats);
router.get("/", requireAdmin, listOrders);
router.get("/:id", requireAdmin, getOrder);
router.patch("/:id/status", requireAdmin, validateBody(orderStatusSchema), updateOrderStatus);
router.patch("/:id/quote", requireAdmin, validateBody(orderQuoteSchema), setOrderQuote);
router.post("/:id/notes", requireAdmin, validateBody(orderNoteSchema), addOrderNote);

export default router;
