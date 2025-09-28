import { createOrder, deleteOrder, getOrderById, getOrders, updateOrder } from '#controllers';
import { Router } from 'express';
import { validateZod } from '#middleware';
import { orderInputSchema, paramSchema } from '#schemas';

const ordersRouter = Router();

ordersRouter.route('/').get(getOrders).post(validateZod(orderInputSchema, 'body'), createOrder);
ordersRouter.use('/:id', validateZod(paramSchema, 'params'));
ordersRouter
  .route('/:id')
  .get(getOrderById)
  .put(validateZod(orderInputSchema, 'body'), updateOrder)
  .delete(deleteOrder);

export default ordersRouter;
