import { Category, Product } from '#models';
import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import { ObjectId } from 'mongodb';
import { productSchema, populatedCategorySchema } from '#schemas';
import type { ProductDTO, ProductInputDTO, SuccessMg } from '#types';
import type z from 'zod/v4';

type Products = SuccessMg & { products: z.infer<typeof productSchema>[] };
type PopulatedCategoryDTO = z.infer<typeof populatedCategorySchema>;
type ProductType = SuccessMg & { product: ProductDTO };

const getProducts: RequestHandler<{}, Products> = async (request, response) => {
  const categoryId = request.sanitQuery?.categoryId;

  let products: z.infer<typeof productSchema>[];
  if (categoryId) {
    products = await Product.find({ categoryId })
      .populate<{ category: PopulatedCategoryDTO }>('categoryId', 'name')
      .lean();
  } else {
    products = await Product.find().populate<{ category: PopulatedCategoryDTO }>('categoryId', 'name').lean();
  }

  response.json({ message: 'List of products', products });
};

const createProduct: RequestHandler<{}, SuccessMg, ProductInputDTO> = async (request, response) => {
  const { name, description, price, categoryId } = request.body;

  const categoryExists = await Category.exists({ _id: categoryId });

  if (!categoryExists) throw new Error('product_category do not exist', { cause: { status: 404 } });

  const product = await Product.create<ProductInputDTO>({ name, description, price, categoryId });

  response.json({ message: 'product created' });
};

const getProductById: RequestHandler<{ id: string }, ProductType, ProductDTO> = async (req, response) => {
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

  response.json({ message: 'searched product', product });
};

const updateProduct: RequestHandler<{ id: string }, SuccessMg, ProductInputDTO> = async (req, response) => {
  const {
    body: { name, description, categoryId, price },
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
  product.price = price;

  await product.save();

  // console.log(product);

  response.json({ message: 'product updated' });
};

const deleteProduct: RequestHandler<{ id: string }, SuccessMg> = async (req, response) => {
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
