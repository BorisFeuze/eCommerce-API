import { createCategory, deleteCategory, getCategoryById, getCategorys, updateCategory } from '#controllers';
import { Router } from 'express';
import { validateZod } from '#middleware';
import { categoryInputSchema, updateCategorySchema } from '#schemas';

const categorysRouter = Router();

categorysRouter.route('/').get(getCategorys).post(validateZod(categoryInputSchema), createCategory);
categorysRouter
  .route('/:id')
  .get(getCategoryById)
  .put(validateZod(updateCategorySchema), updateCategory)
  .delete(deleteCategory);

export default categorysRouter;
