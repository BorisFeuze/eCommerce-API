import { Product } from '#models';
import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import { ObjectId } from 'mongodb';
import { productSchema, productInputSchema } from '#schemas';
import type { z } from 'zod/v4';

type ProductInputDTO = z.infer<typeof productInputSchema>;
type ProductDTO = z.infer<typeof productSchema>;

const getProducts: RequestHandler<{}, ProductDTO[]> = async (req, res) => {
  const products = await Product.find().populate<ProductDTO>('userId', 'firstName lastName email').lean();
  res.json(products);
};

const createProduct: RequestHandler<{}, ProductDTO, ProductInputDTO> = async (req, res) => {
  const product = await Product.create<ProductInputDTO>(req.body);

  const populatedProduct = await product.populate<ProductDTO>('userId', 'firstName lastName email');

  res.json(populatedProduct);
};

const getProductById: RequestHandler<{ id: string }, ProductDTO> = async (req, res) => {
  const {
    params: { id }
  } = req;

  if (!isValidObjectId(id)) {
    throw new Error('Invalid ID', { cause: { status: 400 } });
  }

  const product = await Product.findById(id).populate<ProductDTO>('userId', 'firstName lastName email');

  if (!product) {
    throw new Error('Product not found', { cause: { status: 404 } });
  }

  res.json(product);
};

const updateProduct: RequestHandler<{ id: string }, ProductDTO, ProductInputDTO> = async (req, res) => {
  const {
    body: { title, content, userId },
    params: { id }
  } = req;

  if (!isValidObjectId(id)) {
    throw new Error('Invalid ID', { cause: { status: 400 } });
  }

  const product = await Product.findById(id);

  if (!product) {
    throw new Error('Product not found', { cause: { status: 404 } });
  }

  if (userId !== product.userId.toString()) {
    throw new Error('You are not authorized to update this product', { cause: { status: 403 } });
  }

  product.title = title;
  product.content = content;
  product.userId = ObjectId.createFromHexString(userId);

  await product.save();

  const populatedProduct = await product.populate<ProductDTO>('userId', 'firstName lastName email');

  res.json(populatedProduct);
};

const deleteProduct: RequestHandler<{ id: string }, { message: string }> = async (req, res) => {
  const {
    params: { id }
  } = req;

  if (!isValidObjectId(id)) {
    throw new Error('Invalid ID', { cause: { status: 400 } });
  }

  const product = await Product.findByIdAndDelete(id);

  if (!product) throw new Error('Product not found', { cause: { status: 404 } });

  res.json({ message: 'Product deleted' });
};

export { getProducts, getProductById, createProduct, updateProduct, deleteProduct };
