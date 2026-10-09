import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler, ApiError } from "../middleware/errorHandler";

export const listPublicReviews = asyncHandler(async (_req: Request, res: Response) => {
  const reviews = await prisma.review.findMany({
    where: { status: "APPROVED" },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });
  res.json({ reviews });
});

export const createReview = asyncHandler(async (req: Request, res: Response) => {
  const review = await prisma.review.create({ data: req.body });
  res.status(201).json({ review });
});

export const listAllReviews = asyncHandler(async (req: Request, res: Response) => {
  const { status } = req.query as Record<string, string>;
  const reviews = await prisma.review.findMany({
    where: status && status !== "ALL" ? { status: status as any } : {},
    orderBy: { createdAt: "desc" },
  });
  res.json({ reviews });
});

export const updateReviewStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const review = await prisma.review.update({ where: { id }, data: { status: req.body.status } });
  res.json({ review });
});

export const toggleFeatured = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const existing = await prisma.review.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "Review not found.");
  const review = await prisma.review.update({
    where: { id },
    data: { isFeatured: !existing.isFeatured },
  });
  res.json({ review });
});

export const deleteReview = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  await prisma.review.delete({ where: { id } });
  res.json({ success: true });
});
