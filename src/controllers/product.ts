import { Category, Product } from '#models';
import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import { ObjectId } from 'mongodb';
import type { ProductDTO, ProductInputDTO } from '#types';
import { productSchemaArray } from '#schemas';
import z from 'zod/v4';

const getProducts: RequestHandler = async (request, response) => {
  const categoryId = request.sanitQuery?.categoryId;

  let products: ProductDTO[];
  if (categoryId) {
    products = await Product.find({ categoryId }).populate<ProductDTO>('categoryId', 'name').lean();
  } else {
    products = await Product.find().populate<ProductDTO>('categoryId', 'name').lean();
  }

  const validedProducts = productSchemaArray.parse(products);

  response.json({ message: 'List of products', validedProducts });
};

const createProduct: RequestHandler<{}, {}, ProductInputDTO> = async (request, response) => {
  const { name, description, price, categoryId } = request.body;

  const categoryExists = await Category.exists({ _id: categoryId });

  if (!categoryExists) throw new Error('product_category do not exist', { cause: { status: 404 } });

  const product = await Product.create<ProductInputDTO>({ name, description, price, categoryId });

  response.json({ message: 'product created' });
};

const getProductById: RequestHandler<{ id: string }> = async (req, response) => {
  const {
    params: { id }
  } = req;

  if (!isValidObjectId(id)) {
    throw new Error('Invalid ID', { cause: { status: 400 } });
  }

  const product = await Product.findById(id).populate<ProductDTO>('categoryId', 'name').lean();

  if (!product) {
    throw new Error('Product not found', { cause: { status: 404 } });
  }

  // const { success, data, error } = productSchemaArray.safeParse(product);

  // if (!success) {
  //   console.error(z.prettifyError(error));
  // }

  response.json({ message: 'searched product', /*data*/ product });
};

const updateProduct: RequestHandler<{ id: string }, {}, ProductInputDTO> = async (req, response) => {
  const {
    body: { name, description, categoryId },
    params: { id }
  } = req;

  if (!isValidObjectId(id)) {
    throw new Error('Invalid ID', { cause: { status: 400 } });
  }

  const product = await Product.findById(id);

  if (!product) {
    throw new Error('Product not found', { cause: { status: 404 } });
  }

  if (categoryId !== product.categoryId.toString()) {
    throw new Error('Product is not from the right category', { cause: { status: 400 } });
  }

  product.name = name;
  product.description = description;
  product.categoryId = ObjectId.createFromHexString(categoryId);

  await product.save();

  response.json({ message: 'product updated' });
};

const deleteProduct: RequestHandler<{ id: string }, { message: string }> = async (req, response) => {
  const {
    params: { id }
  } = req;

  if (!isValidObjectId(id)) {
    throw new Error('Invalid ID', { cause: { status: 400 } });
  }

  const product = await Product.findByIdAndDelete(id);

  if (!product) throw new Error('Product not found', { cause: { status: 404 } });

  response.json({ message: 'Product deleted' });
};

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
