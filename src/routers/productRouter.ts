import { createProduct, deleteProduct, getProductById, getProducts, updateProduct } from '#controllers';
import { Router } from 'express';
import { validateZod } from '#middleware';
import { productSchema, updateProductSchema } from '#schemas';

const productRouter = Router();

productRouter.route('/').get(getProducts).post(validateZod(productSchema), createProduct);
productRouter
  .route('/:id')
  .get(getProductById)
  .put(validateZod(updateProductSchema), updateProduct)
  .delete(deleteProduct);

export default productRouter;
