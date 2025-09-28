import { Category } from '#models';
import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import { categorySchema, categorySchemaArray } from '#schemas';
import type { CategoryDTO, CategoryInputDTO } from '#types';
import { z } from 'zod/v4';

const getCategories: RequestHandler = async (request, response) => {
  const categories = await Category.find().lean();

  const { success, data, error } = categorySchemaArray.safeParse(categories);

  if (!success) {
    console.error(z.prettifyError(error));
  }

  response.json({ message: 'List of Categories', data });
};

const createCategory: RequestHandler<{}, {}, CategoryInputDTO> = async (request, response) => {
  const { name } = request.body;

  const category = await Category.create<CategoryInputDTO>({ name });

  response.json({ message: 'category created' });
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

  const { success, data, error } = categorySchema.safeParse(category);

  if (!success) {
    console.error(z.prettifyError(error));
  }

  response.json({ message: 'searched category', data });
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

  const { success, data, error } = categorySchema.safeParse(category);

  if (!success) {
    console.error(z.prettifyError(error));
  }

  response.json({ message: 'category updated', data });
};

const deleteCategory: RequestHandler<{ id: string }, { message: string }> = async (request, response) => {
  const {
    params: { id }
  } = request;

  if (!isValidObjectId(id)) {
    throw new Error('Invalid ID', { cause: { status: 400 } });
  }

  const category = await Category.findByIdAndDelete(id);

  if (!category) throw new Error('category not found', { cause: { status: 404 } });

  response.json({ message: 'category deleted' });
};

export { getCategories, getCategoryById, createCategory, updateCategory, deleteCategory };
