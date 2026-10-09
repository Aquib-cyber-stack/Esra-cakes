import { Router } from "express";
import {
  listCakes,
  getCake,
  createCake,
  updateCake,
  deleteCake,
  addCakeImages,
  deleteCakeImage,
} from "../controllers/cake.controller";
import { requireAdmin } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { cakeSchema } from "../utils/schemas";
import { upload } from "../middleware/upload";

const router = Router();

// Public
router.get("/", listCakes);
router.get("/:id", getCake);

// Admin-only
router.post("/", requireAdmin, validateBody(cakeSchema), createCake);
router.patch("/:id", requireAdmin, updateCake);
router.delete("/:id", requireAdmin, deleteCake);
router.post("/:id/images", requireAdmin, upload.array("images", 6), addCakeImages);
router.delete("/:id/images/:imageId", requireAdmin, deleteCakeImage);

export default router;
