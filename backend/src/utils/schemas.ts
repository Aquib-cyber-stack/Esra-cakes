import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email("Enter a valid email address."),
  password: z.string().min(6, "Password must be at least 6 characters."),
});

export const cakeSchema = z.object({
  name: z.string().min(2, "Name is required."),
  description: z.string().min(10, "Description should be a bit more detailed."),
  category: z.enum(["BIRTHDAY", "WEDDING", "ANNIVERSARY", "KIDS", "CORPORATE", "CUSTOM"]),
  flavours: z.array(z.string()).min(1, "Add at least one flavour."),
  sizes: z.array(z.string()).min(1, "Add at least one size."),
  startingPrice: z.coerce.number().positive("Enter a valid starting price."),
  isAvailable: z.coerce.boolean().optional().default(true),
  isFeatured: z.coerce.boolean().optional().default(false),
});

export const orderSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().min(7, "Enter a valid phone number."),
  cakeId: z.string().optional().nullable(),
  occasion: z.string().min(2, "Tell us the occasion."),
  flavour: z.string().min(2, "Pick a flavour."),
  size: z.string().min(1, "Pick a size."),
  requiredDate: z.coerce.date({ errorMap: () => ({ message: "Pick a valid date." }) }),
  theme: z.string().optional().nullable(),
  message: z.string().optional().nullable(),
  instructions: z.string().optional().nullable(),
  budget: z.coerce.number().positive().optional().nullable(),
  fulfillment: z.enum(["PICKUP", "DELIVERY"]),
  address: z.string().optional().nullable(),
}).refine(
  (data) => data.fulfillment !== "DELIVERY" || (data.address && data.address.length > 5),
  { message: "Please provide a delivery address.", path: ["address"] }
);

export const orderStatusSchema = z.object({
  status: z.enum(["PENDING", "REVIEWING", "QUOTE_SENT", "CONFIRMED", "BAKING", "READY", "COMPLETED", "CANCELLED"]),
});

export const orderQuoteSchema = z.object({
  quote: z.coerce.number().positive("Enter a valid quote amount."),
});

export const orderNoteSchema = z.object({
  note: z.string().min(1, "Note cannot be empty."),
});

export const reviewSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  rating: z.coerce.number().int().min(1).max(5),
  message: z.string().min(10, "Tell us a bit more about your experience."),
  occasion: z.string().optional().nullable(),
});

export const reviewStatusSchema = z.object({
  status: z.enum(["PENDING", "APPROVED", "REJECTED"]),
});

export const contactSchema = z.object({
  name: z.string().min(2, "Please enter your name."),
  email: z.string().email("Enter a valid email address."),
  phone: z.string().optional().nullable(),
  subject: z.string().optional().nullable(),
  message: z.string().min(10, "Message should be a bit more detailed."),
});
