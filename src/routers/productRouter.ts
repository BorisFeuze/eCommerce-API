import { getProducts, deleteProduct, updateProduct, createProduct, getProductById } from '#controllers';
import { Router } from 'express';
import { validateZod } from '#middleware';
import { productInputSchema, querySchema, paramSchema } from '#schemas';

const productRouter = Router();

productRouter
  .route('/')
  .get(validateZod(querySchema, 'query'), getProducts)
  .post(validateZod(productInputSchema, 'body'), createProduct);
productRouter.use('./:id', validateZod(paramSchema, 'params'));
productRouter
  .route('/:id')
  .get(getProductById)
  .put(validateZod(productInputSchema, 'body'), updateProduct)
  .delete(deleteProduct);

export default productRouter;
