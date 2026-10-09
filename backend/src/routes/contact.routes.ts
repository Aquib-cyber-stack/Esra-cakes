import { Router } from "express";
import {
  submitContactMessage,
  listContactMessages,
  markMessageRead,
  deleteContactMessage,
} from "../controllers/contact.controller";
import { requireAdmin } from "../middleware/auth";
import { validateBody } from "../middleware/validate";
import { contactSchema } from "../utils/schemas";

const router = Router();

router.post("/", validateBody(contactSchema), submitContactMessage);

router.get("/", requireAdmin, listContactMessages);
router.patch("/:id/read", requireAdmin, markMessageRead);
router.delete("/:id", requireAdmin, deleteContactMessage);

export default router;
