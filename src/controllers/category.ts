import { Category } from '#models';
import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import { ObjectId } from 'mongodb';
import { categorySchema, categoryInputSchema } from '#schemas';
import type { z } from 'zod/v4';

type CategoryInputDTO = z.infer<typeof categoryInputSchema>;
type CategoryDTO = z.infer<typeof categorySchema>;

const getCategorys: RequestHandler<{}, CategoryDTO[]> = async (request, response) => {
  const { owner } = request.query;
  let categorys: CategoryDTO[];
  if (owner) {
    categorys = await Category.find({ owner }).populate<CategoryDTO>('userId', 'firstName lastName email').lean();
    response.json(categorys);
  } else {
    categorys = await Category.find().populate<CategoryDTO>('userId', 'firstName lastName email').lean();
    response.json(categorys);
  }
};

const createCategory: RequestHandler<{}, CategoryDTO, CategoryInputDTO> = async (request, response) => {
  const category = await Category.create<CategoryInputDTO>(request.body);

  const populatedCategory = await category.populate<CategoryDTO>('userId', 'firstName lastName email');

  response.json(populatedCategory);
};

const getCategoryById: RequestHandler<{ id: string }, CategoryDTO> = async (request, response) => {
  const {
    params: { id }
  } = request;

  if (!isValidObjectId(id)) {
    throw new Error('Invalid ID', { cause: { status: 400 } });
  }

  const category = await Category.findById(id).populate<CategoryDTO>('userId', 'firstName lastName email');

  if (!category) {
    throw new Error('Category not found', { cause: { status: 404 } });
  }

  response.json(category);
};

const updateCategory: RequestHandler<{ id: string }, CategoryDTO, CategoryInputDTO> = async (request, response) => {
  const {
    body: { title, content, userId },
    params: { id }
  } = request;

  if (!isValidObjectId(id)) {
    throw new Error('Invalid ID', { cause: { status: 400 } });
  }

  const category = await Category.findById(id);

  if (!category) {
    throw new Error('Category not found', { cause: { status: 404 } });
  }

  if (userId !== category.userId.toString()) {
    throw new Error('You are not authorized to update this category', { cause: { status: 403 } });
  }

  category.title = title;
  category.content = content;
  category.userId = ObjectId.createFromHexString(userId);

  await category.save();

  const populatedCategory = await category.populate<CategoryDTO>('userId', 'firstName lastName email');

  response.json(populatedCategory);
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
