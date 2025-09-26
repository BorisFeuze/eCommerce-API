import { Category } from '#models';
import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import { ObjectId } from 'mongodb';
import { categorySchema, categoryInputSchema } from '#schemas';
import type { z } from 'zod/v4';

type CategoryInputDTO = z.infer<typeof categoryInputSchema>;
type CategoryDTO = z.infer<typeof categorySchema>;

const getCategorys: RequestHandler = async (request, response) => {
  const categories = await Category.find().lean();

  response.json({ message: 'List of Categories', categories });
};

const createCategory: RequestHandler<{}, {}, CategoryInputDTO> = async (request, response) => {
  const { name } = request.body;

  const category = await Category.create<CategoryInputDTO>({ name });

  response.json({ message: 'created category', category });
};

const getCategoryById: RequestHandler<{ id: string }> = async (request, response) => {
  const {
    params: { id }
  } = request;

  if (!isValidObjectId(id)) {
    throw new Error('Invalid ID', { cause: { status: 400 } });
  }

  const category = await Category.findById(id).lean();

  if (!category) {
    throw new Error('Category not found', { cause: { status: 404 } });
  }

  response.json({ message: 'searched category', category });
};

const updateCategory: RequestHandler<{ id: string }> = async (request, response) => {
  const {
    body: { name },
    params: { id }
  } = request;

  if (!isValidObjectId(id)) {
    throw new Error('Invalid ID', { cause: { status: 400 } });
  }

  const category = await Category.findById(id);

  if (!category) {
    throw new Error('Category not found', { cause: { status: 404 } });
  }

  category.name = name;

  await category.save();

  response.json({ message: 'updated category', category });
};

const deleteCategory: RequestHandler<{ id: string }, { message: string }> = async (request, response) => {
  const {
    params: { id }
  } = request;

  if (!isValidObjectId(id)) {
    throw new Error('Invalid ID', { cause: { status: 400 } });
  }

  const category = await Category.findByIdAndDelete(id);

  if (!category) throw new Error('Category not found', { cause: { status: 404 } });

  response.json({ message: 'Category deleted' });
};

export { getCategorys, getCategoryById, createCategory, updateCategory, deleteCategory };
