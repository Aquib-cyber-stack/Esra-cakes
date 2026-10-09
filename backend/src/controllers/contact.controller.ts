import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler, ApiError } from "../middleware/errorHandler";

export const submitContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const message = await prisma.contactMessage.create({ data: req.body });
  res.status(201).json({ message });
});

export const listContactMessages = asyncHandler(async (req: Request, res: Response) => {
  const { unreadOnly } = req.query as Record<string, string>;
  const messages = await prisma.contactMessage.findMany({
    where: unreadOnly === "true" ? { isRead: false } : {},
    orderBy: { createdAt: "desc" },
  });
  res.json({ messages });
});

export const markMessageRead = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const message = await prisma.contactMessage.update({ where: { id }, data: { isRead: true } });
  res.json({ message });
});

export const deleteContactMessage = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const existing = await prisma.contactMessage.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Message not found.");
  await prisma.contactMessage.delete({ where: { id } });
  res.json({ success: true });
});
