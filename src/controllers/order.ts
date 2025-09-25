import { Order } from '#models';
import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import { ObjectId } from 'mongodb';
import { orderSchema, orderInputSchema } from '#schemas';
import type { z } from 'zod/v4';

type OrderInputDTO = z.infer<typeof orderInputSchema>;
type OrderDTO = z.infer<typeof orderSchema>;

const getOrders: RequestHandler<{}, OrderDTO[]> = async (request, response) => {
  const owner = request.sanitQuery?.owner;

  let orders: OrderDTO[];
  if (owner) {
    orders = await Order.find({ owner }).populate<OrderDTO>('userId', 'firstName lastName email').lean();
    response.json(orders);
  } else {
    orders = await Order.find().populate<OrderDTO>('userId', 'firstName lastName email').lean();
    response.json(orders);
  }
};

const createOrder: RequestHandler<{}, OrderDTO, OrderInputDTO> = async (request, response) => {
  const order = await Order.create<OrderInputDTO>(request.body);

  const populatedOrder = await order.populate<OrderDTO>('userId', 'firstName lastName email');

  response.json(populatedOrder);
};

const getOrderById: RequestHandler<{ id: string }, OrderDTO> = async (request, response) => {
  const {
    params: { id }
  } = request;

  if (!isValidObjectId(id)) {
    throw new Error('Invalid ID', { cause: { status: 400 } });
  }

  const order = await Order.findById(id).populate<OrderDTO>('userId', 'firstName lastName email');

  if (!order) {
    throw new Error('Order not found', { cause: { status: 404 } });
  }

  response.json(order);
};

const updateOrder: RequestHandler<{ id: string }, OrderDTO, OrderInputDTO> = async (request, response) => {
  const {
    body: { title, content, userId },
    params: { id }
  } = request;

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

  response.json(populatedOrder);
};

const deleteOrder: RequestHandler<{ id: string }, { message: string }> = async (request, response) => {
  const {
    params: { id }
  } = request;

  if (!isValidObjectId(id)) {
    throw new Error('Invalid ID', { cause: { status: 400 } });
  }

  const order = await Order.findByIdAndDelete(id);

  if (!order) throw new Error('Order not found', { cause: { status: 404 } });

  response.json({ message: 'Order deleted' });
};

export { getOrders, getOrderById, createOrder, updateOrder, deleteOrder };
