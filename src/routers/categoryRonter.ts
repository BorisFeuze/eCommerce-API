import { createCategory, deleteCategory, getCategoryById, getCategorys, updateCategory } from '#controllers';
import { Router } from 'express';
import { validateZod } from '#middleware';
import { categoryInputSchema, paramSchema } from '#schemas';

const categorysRouter = Router();

categorysRouter.route('/').get(getCategorys).post(validateZod(categoryInputSchema, 'body'), createCategory);
categorysRouter.use('/:id', validateZod(paramSchema, 'params'));
categorysRouter
  .route('/:id')
  .get(getCategoryById)
  .put(validateZod(categoryInputSchema, 'body'), updateCategory)
  .delete(deleteCategory);

export default categorysRouter;
