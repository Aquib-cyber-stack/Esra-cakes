import { Request, Response } from "express";
import { prisma } from "../lib/prisma";
import { asyncHandler, ApiError } from "../middleware/errorHandler";
import { generateOrderReference } from "../lib/reference";
import { publicUrlFor } from "../middleware/upload";
import { AuthedRequest } from "../middleware/auth";

export const createOrder = asyncHandler(async (req: Request, res: Response) => {
  const data = req.body;
  const reference = await generateOrderReference();

  const files = (req.files as Express.Multer.File[]) || [];

  const order = await prisma.order.create({
    data: {
      reference,
      name: data.name,
      email: data.email,
      phone: data.phone,
      cakeId: data.cakeId || null,
      occasion: data.occasion,
      flavour: data.flavour,
      size: data.size,
      requiredDate: data.requiredDate,
      theme: data.theme || null,
      message: data.message || null,
      instructions: data.instructions || null,
      budget: data.budget || null,
      fulfillment: data.fulfillment,
      address: data.address || null,
      referenceImages: {
        create: files.map((f) => ({ url: publicUrlFor(f.filename) })),
      },
    },
    include: { referenceImages: true },
  });

  res.status(201).json({ order });
});

export const trackOrder = asyncHandler(async (req: Request, res: Response) => {
  const { reference } = req.params;
  const order = await prisma.order.findUnique({
    where: { reference },
    select: {
      reference: true,
      status: true,
      requiredDate: true,
      createdAt: true,
      quote: true,
    },
  });
  if (!order) throw new ApiError(404, "No order found with that reference.");
  res.json({ order });
});

// ----- Admin -----

export const listOrders = asyncHandler(async (req: Request, res: Response) => {
  const { status, search } = req.query as Record<string, string>;

  const orders = await prisma.order.findMany({
    where: {
      ...(status && status !== "ALL" ? { status: status as any } : {}),
      ...(search
        ? {
            OR: [
              { reference: { contains: search, mode: "insensitive" } },
              { name: { contains: search, mode: "insensitive" } },
              { email: { contains: search, mode: "insensitive" } },
              { phone: { contains: search, mode: "insensitive" } },
            ],
          }
        : {}),
    },
    include: { cake: { select: { name: true } }, referenceImages: true },
    orderBy: { createdAt: "desc" },
  });

  res.json({ orders });
});

export const getOrder = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      cake: true,
      referenceImages: true,
      notes: { include: { admin: { select: { name: true } } }, orderBy: { createdAt: "desc" } },
    },
  });
  if (!order) throw new ApiError(404, "Order not found.");
  res.json({ order });
});

export const updateOrderStatus = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await prisma.order.update({ where: { id }, data: { status: req.body.status } });
  res.json({ order });
});

export const setOrderQuote = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const order = await prisma.order.update({
    where: { id },
    data: { quote: req.body.quote, status: "QUOTE_SENT" },
  });
  res.json({ order });
});

export const addOrderNote = asyncHandler(async (req: AuthedRequest, res: Response) => {
  const { id } = req.params;
  const note = await prisma.orderNote.create({
    data: { orderId: id, note: req.body.note, adminId: req.admin?.id },
    include: { admin: { select: { name: true } } },
  });
  res.status(201).json({ note });
});

export const dashboardStats = asyncHandler(async (_req: Request, res: Response) => {
  const [total, pending, confirmed, completed, revenueAgg, recent, upcoming] = await Promise.all([
    prisma.order.count(),
    prisma.order.count({ where: { status: { in: ["PENDING", "REVIEWING", "QUOTE_SENT"] } } }),
    prisma.order.count({ where: { status: { in: ["CONFIRMED", "BAKING", "READY"] } } }),
    prisma.order.count({ where: { status: "COMPLETED" } }),
    prisma.order.aggregate({ _sum: { quote: true }, where: { status: "COMPLETED" } }),
    prisma.order.findMany({ take: 5, orderBy: { createdAt: "desc" } }),
    prisma.order.findMany({
      take: 5,
      where: { requiredDate: { gte: new Date() }, status: { notIn: ["COMPLETED", "CANCELLED"] } },
      orderBy: { requiredDate: "asc" },
    }),
  ]);

  res.json({
    stats: {
      totalOrders: total,
      pendingRequests: pending,
      confirmedOrders: confirmed,
      completedOrders: completed,
      revenue: revenueAgg._sum.quote || 0,
    },
    recentOrders: recent,
    upcomingOrders: upcoming,
  });
});
