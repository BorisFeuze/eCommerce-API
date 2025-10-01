import { User } from '#models';
import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import type { z } from 'zod/v4';
import { userSchemaArray, userByIdSchema } from '#schemas';
import type { UserInputDTO, SuccessMg } from '#types';

type GetUsersType = SuccessMg & { users: z.infer<typeof userSchemaArray> };

type GetUserType = SuccessMg & { user: z.infer<typeof userByIdSchema> };

const getUsers: RequestHandler<{}, GetUsersType> = async (request, response) => {
  const users = await User.find().select('-password').lean();

  response.json({ message: 'List of users', users });
};

const createUser: RequestHandler<{}, SuccessMg, UserInputDTO> = async (request, response) => {
  const { name, email, password } = request.body;

  const found = await User.findOne({ email });
  if (found) {
    throw new Error('User already exists', { cause: { status: 400 } });
  }
  const user = await User.create<UserInputDTO>({ name, email, password });

  response.json({ message: 'user created' });
};

const getUserById: RequestHandler<{ id: string }, GetUserType> = async (request, response) => {
  const {
    params: { id }
  } = request;

  if (!isValidObjectId(id)) {
    throw new Error('Invalid ID', { cause: { status: 400 } });
  }

  const user = await User.findById(id).select('-password').lean();
  if (!user) {
    throw new Error('User not found', { cause: { status: 404 } });
  }

  response.json({ message: 'searched user', user });
};

const updateUser: RequestHandler<{ id: string }, SuccessMg> = async (request, response) => {
  const {
    body: { email, password, name },
    params: { id }
  } = request;

  if (!isValidObjectId(id)) {
    throw new Error('Invalid ID', { cause: { status: 400 } });
  }

  const user = await User.findById(id);

  if (!user) {
    throw new Error('User not found', { cause: { status: 404 } });
  }

  user.name = name;
  user.email = email;
  user.password = password;

  await user.save();

  response.json({ message: 'user updated' });
};

const deleteUser: RequestHandler<{ id: string }, SuccessMg> = async (request, response) => {
  const {
    params: { id }
  } = request;

  if (!isValidObjectId(id)) {
    throw new Error('Invalid ID', { cause: { status: 400 } });
  }

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new Error('User not found', { cause: { status: 404 } });
  }
  response.json({ message: 'User deleted' });
};

export { getUsers, getUserById, createUser, updateUser, deleteUser };
