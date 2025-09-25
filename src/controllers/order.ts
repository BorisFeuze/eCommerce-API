import { Order } from '#models';
import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import { ObjectId } from 'mongodb';
import { orderSchema, orderInputSchema } from '#schemas';
import type { z } from 'zod/v4';

type OrderInputDTO = z.infer<typeof orderInputSchema>;
type OrderDTO = z.infer<typeof orderSchema>;

const getOrders: RequestHandler<{}, OrderDTO[]> = async (req, res) => {
  const orders = await Order.find().populate<OrderDTO>('userId', 'firstName lastName email').lean();
  res.json(orders);
};

const createOrder: RequestHandler<{}, OrderDTO, OrderInputDTO> = async (req, res) => {
  const order = await Order.create<OrderInputDTO>(req.body);

  const populatedOrder = await order.populate<OrderDTO>('userId', 'firstName lastName email');

  res.json(populatedOrder);
};

const getOrderById: RequestHandler<{ id: string }, OrderDTO> = async (req, res) => {
  const {
    params: { id }
  } = req;

  if (!isValidObjectId(id)) {
    throw new Error('Invalid ID', { cause: { status: 400 } });
  }

  const order = await Order.findById(id).populate<OrderDTO>('userId', 'firstName lastName email');

  if (!order) {
    throw new Error('Order not found', { cause: { status: 404 } });
  }

  res.json(order);
};

const updateOrder: RequestHandler<{ id: string }, OrderDTO, OrderInputDTO> = async (req, res) => {
  const {
    body: { title, content, userId },
    params: { id }
  } = req;

  if (!isValidObjectId(id)) {
    throw new Error('Invalid ID', { cause: { status: 400 } });
  }

  const order = await Order.findById(id);

  if (!order) {
    throw new Error('Order not found', { cause: { status: 404 } });
  }

  if (userId !== order.userId.toString()) {
    throw new Error('You are not authorized to update this order', { cause: { status: 403 } });
  }

  order.title = title;
  order.content = content;
  order.userId = ObjectId.createFromHexString(userId);

  await order.save();

  const populatedOrder = await order.populate<OrderDTO>('userId', 'firstName lastName email');

  res.json(populatedOrder);
};

const deleteOrder: RequestHandler<{ id: string }, { message: string }> = async (req, res) => {
  const {
    params: { id }
  } = req;

  if (!isValidObjectId(id)) {
    throw new Error('Invalid ID', { cause: { status: 400 } });
  }

  const order = await Order.findByIdAndDelete(id);

  if (!order) throw new Error('Order not found', { cause: { status: 404 } });

  res.json({ message: 'Order deleted' });
};

export { getOrders, getOrderById, createOrder, updateOrder, deleteOrder };
