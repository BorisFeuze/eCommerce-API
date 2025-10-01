import { Order, Product, User } from '#models';
import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import { ObjectId } from 'mongodb';
import { orderSchemaArray, populatedUserSchema, populatedProductSchema } from '#schemas';
import type { z } from 'zod/v4';
import type { OrderDTO, OrderInputDTO, SuccessMg, ProductsType } from '#types';

type GetOrderType = SuccessMg & { orders: z.infer<typeof orderSchemaArray> };
type GetOrderByIdType = SuccessMg & { order: OrderDTO };
type PopulatedUserDTO = z.infer<typeof populatedUserSchema>;
type PopulatedProductDTO = z.infer<typeof populatedProductSchema>;

const getOrders: RequestHandler<{}, GetOrderType> = async (request, response) => {
  const orders = await Order.find()
    .lean()
    .populate<{ user: PopulatedUserDTO }>('userId', 'name email')
    .populate<{ products: PopulatedProductDTO }>('products.productId', 'name price');
  response.json({ message: 'List of products', orders });
};

const createOrder: RequestHandler<{}, SuccessMg, OrderInputDTO> = async (request, response) => {
  const {
    body: { userId, products, total }
  } = request;
  // console.log(request.body);
  const _id = userId;

  const userExists = await User.exists({ _id });
  if (!userExists) throw new Error('userID not found', { cause: { status: 404 } });

  let totalCost = 0;

  for (let product of products) {
    const { productId, quantity } = product;

    const _id = productId;
    const productExists = await Product.exists({ _id });

    if (!productExists) throw new Error('product not found', { cause: { status: 404 } });

    // console.log(productExists);

    const searchP = await Product.findById({ _id });

    // console.log(price);

    totalCost += quantity * Number(searchP?.price);
  }

  const order = await Order.create<OrderInputDTO>({ userId, products, total: totalCost });

  const populatedOrder = await order.populate<{ products: PopulatedProductDTO }>('products.productId', 'name price');

  // console.log(populatedOrder);

  response.json({ message: 'order created' });
};

const getOrderById: RequestHandler<{ id: string }, GetOrderByIdType> = async (request, response) => {
  const {
    params: { id }
  } = request;

  if (!isValidObjectId(id)) {
    throw new Error('Invalid orderID', { cause: { status: 400 } });
  }

  const order = await Order.findById(id)
    .populate<{ user: PopulatedUserDTO }>('userId', 'name email')
    .populate<{ products: PopulatedProductDTO }>('products.productId', 'name price');

  if (!order) {
    throw new Error('Order not found', { cause: { status: 404 } });
  }

  response.json({ message: 'searched product', order });
};

const updateOrder: RequestHandler<{ id: string }, SuccessMg, OrderInputDTO> = async (request, response) => {
  const {
    body: { userId, total },
    params: { id }
  } = request;

  const [{ productId, quantity } = {} as ProductsType] = request.body.products ?? [];

  if (!isValidObjectId(id)) {
    throw new Error('Invalid orderID', { cause: { status: 400 } });
  }

  const order = await Order.findById(id);

  if (!order) {
    throw new Error('Order not found', { cause: { status: 404 } });
  }

  if (userId !== order.userId.toString()) {
    throw new Error('You are not authorized to update this order', { cause: { status: 403 } });
  }

  let totalCost = 0;

  for (let product of request.body.products) {
    const { productId, quantity } = product;

    const _id = productId;
    const productExists = await Product.exists({ _id });

    if (!productExists) throw new Error('product not found', { cause: { status: 404 } });

    // console.log(productExists);

    const searchP = await Product.findById({ _id });

    // console.log(price);

    totalCost += quantity * Number(searchP?.price);
  }

  order.userId = ObjectId.createFromHexString(userId);
  order.products.push({ productId: ObjectId.createFromHexString(productId), quantity: quantity });
  order.total = totalCost;

  await order.save();

  const data = await order.populate<{ user: PopulatedUserDTO }>('userId', 'name email');

  const populatedOrder = await data.populate<{ product: PopulatedProductDTO }>('products.productId', 'name price');

  response.json({ message: 'order updated' });
};

const deleteOrder: RequestHandler<{ id: string }, SuccessMg> = async (request, response) => {
  const {
    params: { id }
  } = request;

  if (!isValidObjectId(id)) {
    throw new Error('Invalid orderID', { cause: { status: 400 } });
  }

  const order = await Order.findByIdAndDelete(id);

  if (!order) throw new Error('Order not found', { cause: { status: 404 } });

  response.json({ message: 'Order deleted' });
};

export { getOrders, getOrderById, createOrder, updateOrder, deleteOrder };
