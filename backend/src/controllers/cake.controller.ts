import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler, ApiError } from "../middleware/errorHandler";
import { publicUrlFor } from "../middleware/upload";

function slugify(name: string) {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export const listCakes = asyncHandler(async (req: Request, res: Response) => {
  const { category, search, featured, availableOnly } = req.query as Record<string, string>;

  const cakes = await prisma.cake.findMany({
    where: {
      ...(category && category !== "ALL" ? { category: category as any } : {}),
      ...(featured === "true" ? { isFeatured: true } : {}),
      ...(availableOnly === "true" ? { isAvailable: true } : {}),
      ...(search
        ? {
            OR: [
              { name: { contains: search, mode: "insensitive" } },
              { description: { contains: search, mode: "insensitive" } },
              { flavours: { has: search } },
            ],
          }
        : {}),
    },
    include: { images: { orderBy: { sortOrder: "asc" } } },
    orderBy: [{ isFeatured: "desc" }, { createdAt: "desc" }],
  });

  res.json({ cakes });
});

export const getCake = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const cake = await prisma.cake.findFirst({
    where: { OR: [{ id }, { slug: id }] },
    include: { images: { orderBy: { sortOrder: "asc" } } },
  });
  if (!cake) throw new ApiError(404, "That cake couldn't be found.");
  res.json({ cake });
});

export const createCake = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  const slugBase = slugify(data.name);
  let slug = slugBase;
  let n = 1;
  while (await prisma.cake.findUnique({ where: { slug } })) {
    slug = `${slugBase}-${++n}`;
  }

  const cake = await prisma.cake.create({
    data: { ...data, slug },
  });
  res.status(201).json({ cake });
});

export const updateCake = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const existing = await prisma.cake.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "That cake couldn't be found.");

  const cake = await prisma.cake.update({ where: { id }, data: req.body });
  res.json({ cake });
});

export const deleteCake = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const existing = await prisma.cake.findUnique({ where: { id } });
  if (!existing) throw new ApiError(404, "That cake couldn't be found.");

  await prisma.cake.delete({ where: { id } });
  res.json({ success: true });
});

export const addCakeImages = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const cake = await prisma.cake.findUnique({ where: { id } });
  if (!cake) throw new ApiError(404, "That cake couldn't be found.");

  const files = (req.files as Express.Multer.File[]) || [];
  if (!files.length) throw new ApiError(400, "No images were uploaded.");

  const existingCount = await prisma.cakeImage.count({ where: { cakeId: id } });

  const images = await prisma.$transaction(
    files.map((file, i) =>
      prisma.cakeImage.create({
        data: {
          cakeId: id,
          url: publicUrlFor(file.filename),
          isPrimary: existingCount === 0 && i === 0,
          sortOrder: existingCount + i,
        },
      })
    )
  );

  res.status(201).json({ images });
});

export const deleteCakeImage = asyncHandler(async (req: Request, res: Response) => {
  const { imageId } = req.params;
  const image = await prisma.cakeImage.findUnique({ where: { id: imageId } });
  if (!image) throw new ApiError(404, "Image not found.");
  await prisma.cakeImage.delete({ where: { id: imageId } });
  res.json({ success: true });
});
