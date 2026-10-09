import { Router } from "express";
import {
  listPublicReviews,
  createReview,
  listAllReviews,
  updateReviewStatus,
  toggleFeatured,
  deleteReview,
} from "../controllers/review.controller";
import { requireAdmin } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { reviewSchema, reviewStatusSchema } from "../utils/schemas";

const router = Router();

router.get("/", listPublicReviews);
router.post("/", validateBody(reviewSchema), createReview);

router.get("/admin/all", requireAdmin, listAllReviews);
router.patch("/:id/status", requireAdmin, validateBody(reviewStatusSchema), updateReviewStatus);
router.patch("/:id/feature", requireAdmin, toggleFeatured);
router.delete("/:id", requireAdmin, deleteReview);

export default router;
