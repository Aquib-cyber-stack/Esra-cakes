import { Router } from "express";

const router = Router();

// Public, non-sensitive site configuration the frontend needs at runtime
// (keeps the WhatsApp number configurable via env rather than hard-coded in the UI).
router.get("/", (_req, res) => {
  res.json({
    whatsappNumber: process.env.WHATSAPP_NUMBER || "",
    businessHours: {
      weekdays: "9:00 AM – 7:00 PM",
      saturday: "10:00 AM – 6:00 PM",
      sunday: "By appointment only",
    },
  });
});

export default router;
