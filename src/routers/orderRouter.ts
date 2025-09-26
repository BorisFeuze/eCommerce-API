// import { createOrder, deleteOrder, getOrderById, getOrders, updateOrder } from '#controllers';
import { Router } from 'express';
// import { validateZod } from '#middleware';
// import { orderInputSchema, updateOrderSchema } from '#schemas';

const ordersRouter = Router();

// ordersRouter.route('/').get(getOrders).post(validateZod(orderInputSchema), createOrder);
// ordersRouter.route('/:id').get(getOrderById).put(validateZod(updateOrderSchema), updateOrder).delete(deleteOrder);

export default ordersRouter;
