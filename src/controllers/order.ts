import { Order, Product, User } from '#models';
import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import { ObjectId } from 'mongodb';
import { orderSchema, orderInputSchema, orderSchemaArray, productItemSchema } from '#schemas';
import { z } from 'zod/v4';
import type { OrderDTO, OrderInputDTO, ProductDTO, ProductInputDTO } from '#types';

const getOrders: RequestHandler = async (request, response) => {
  const orders = await Order.find()
    .populate('userId', 'name email')
    .populate('products.productId', 'name price')
    .lean();

  const { success, data, error } = orderSchemaArray.safeParse(orders);

  if (!success) {
    throw new Error(z.prettifyError(error), { cause: { status: 400 } });
  }
  response.json({ message: 'List of products', data /*orders*/ });
};

const createOrder: RequestHandler<{}, {}, OrderInputDTO> = async (request, response) => {
  const {
    body: { userId, products, total }
  } = request;
  // console.log(...request.body);
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

    const { price } = await Product.findById<ProductInputDTO>({ _id });

    // console.log(price);

    totalCost += quantity * Number(price);
  }

  const order = await Order.create({ userId, products, total: totalCost });

  const populatedOrder = await order.populate('products.productId', 'name price');

  console.log(populatedOrder);

  response.json({ message: 'order created' });
};

const getOrderById: RequestHandler<{ id: string }> = async (request, response) => {
  const {
    params: { id }
  } = request;

  if (!isValidObjectId(id)) {
    throw new Error('Invalid orderID', { cause: { status: 400 } });
  }

  const order = await Order.findById(id).populate('userId', 'name email').populate('products.productId', 'name price');

  if (!order) {
    throw new Error('Order not found', { cause: { status: 404 } });
  }

  const { success, data, error } = orderSchema.safeParse(order);

  if (!success) {
    console.error(z.prettifyError(error));
  }

  response.json({ message: 'searched product', data });
};

const updateOrder: RequestHandler<{ id: string }, {}, OrderInputDTO> = async (request, response) => {
  const {
    body: { userId, products, total },
    params: { id }
  } = request;

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

  order.userId = ObjectId.createFromHexString(userId);
  order.products = products[{ productId, quantity }];
  order.total = total;

  await order.save();

  const data = await order.populate('userId', 'name email');

  const populatedOrder = await data.populate('products.productId', 'name price');

  response.json({ message: 'order updated' });
};

const deleteOrder: RequestHandler<{ id: string }, { message: string }> = async (request, response) => {
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
