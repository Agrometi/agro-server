import { Async, AppError } from "../lib";
import { Order } from "../models";

import { OrderT, OrderProductT } from "../types/models/order.types";

export const createOrder = Async(async (req, res, next) => {
  const body = req.body;

  const ordersCount = await Order.countDocuments();

  function formatNumberWithLeadingZeros() {
    return String(ordersCount + 1).padStart(8, "0");
  }

  await new Order({
    invoiceNumber: `INV:${formatNumberWithLeadingZeros()}-${Date.now()}`,
    products: body.products.map((product: OrderProductT) => {
      const candidateProduct: Partial<OrderProductT> = {
        productType: product.productType,
        quantity: product.quantity,
        size: product.size,
        sizeUnit: product.sizeUnit,
        title: product.title,
        price: product.price,
        thumbnail: product.thumbnail,
        productId: product.productId,
        description: product.description,
      };

      return candidateProduct;
    }),
    customerName: body.fullname,
    customerAddress: body.address,
    customerId: { value: body.id_number, iv: "", key: "" },
    customerPhone: { value: body.phone_number, iv: "", key: "" },
    totalPrice: body.totalPrice,
    status: "PENDING",
  }).save();

  res.status(201).json("order is created");
});

export const getOrders = Async(async (req, res, next) => {
  const orders = await Order.aggregate([
    { $match: { createdAt: { $exists: true, $ne: null } } },

    {
      $group: {
        _id: { month: { $month: "$createdAt" }, year: { $year: "$createdAt" } },
        totalOrders: { $sum: 1 },
        orders: { $push: "$$ROOT" },
      },
    },

    {
      $unset: [
        "orders.__v",
        "orders.updatedAt",
        "orders.customerId",
        "orders.customerPhone",
      ],
    },

    { $unwind: "$orders" },

    { $unwind: "$orders.products" },

    {
      $group: {
        _id: { month: "$_id.month", year: "$_id.year", orderId: "$orders._id" },
        totalOrders: { $first: "$totalOrders" },
        orders: { $push: "$orders" },
      },
    },

    {
      $addFields: {
        order: {
          customerName: { $first: "$orders.customerName" },
          customerAddress: { $first: "$orders.customerAddress" },
          status: { $first: "$orders.status" },
          createdAt: { $first: "$orders.createdAt" },
          _id: { $first: "$orders._id" },
          products: {
            $map: { input: "$orders", as: "item", in: "$$item.products" },
          },
        },
      },
    },

    { $project: { _id: 1, totalOrders: 1, order: 1 } },

    {
      $group: {
        _id: { month: "$_id.month", year: "$_id.year" },
        totalOrders: { $first: "$totalOrders" },
        orders: { $push: "$order" },
      },
    },

    {
      $project: {
        orders: 1,
        totalOrders: 1,
        dateRange: { year: "$_id.year", month: "$_id.month" },
      },
    },

    { $sort: { "dateRange.year": -1, "dateRange.month": -1 } },
  ]);

  res.status(200).json(orders);
});

export const getOrder = Async(async (req, res, next) => {
  const { orderId } = req.params;

  const order = await Order.findById(orderId).select("-__v -updatedAt");

  if (!order) return next(new AppError(404, "Order does not exists"));

  const decryption = order.decryptOrder({
    id: order.customerId,
    phone: order.customerPhone,
  });

  type OrderInstanceT = OrderT & { _doc: OrderT };
  const plainOrder = (order as unknown as OrderInstanceT)._doc;

  const modifiedOrder = {
    ...plainOrder,
    customerId: decryption?.id || "",
    customerPhone: decryption?.phone || "",
  };

  res.status(200).json(modifiedOrder);
});

export const treeTrunkOrder = Async(async (req, res, next) => {
  const { orderId } = req.params;
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(orderId, { $set: { status } });

  if (!order) return next(new AppError(404, "Order does not exists"));

  res.status(201).json("Order status is updated");
});
