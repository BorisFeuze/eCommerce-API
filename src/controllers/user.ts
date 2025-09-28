import { User } from '#models';
import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import { z } from 'zod/v4';
import { userSchema, userInputSchema, userSchemaArray } from '#schemas';
import type { UserDTO, UserInputDTO } from '#types';

const getUsers: RequestHandler = async (request, response) => {
  const users = await User.find().select('-password').lean();

  const { success, data, error } = userSchemaArray.safeParse(users);

  if (!success) {
    console.error(z.prettifyError(error));
  }

  response.json({ massege: 'List of users', data });
};

const createUser: RequestHandler<{}, {}, UserInputDTO> = async (request, response) => {
  const { name, email, password } = request.body;

  const found = await User.findOne({ email });
  if (found) {
    throw new Error('User already exists', { cause: { status: 400 } });
  }
  const user = await User.create<UserInputDTO>({ name, email, password });

  response.json({ message: 'user created' });
};

const getUserById: RequestHandler<{ id: string }> = async (request, response) => {
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

  const { success, data, error } = userSchema.safeParse(user);

  if (!success) {
    console.error(z.prettifyError(error));
  }

  response.json({ message: 'searched user', data });
};

const updateUser: RequestHandler<{ id: string }> = async (request, response) => {
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

const deleteUser: RequestHandler<{ id: string }, { message: string }> = async (request, response) => {
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
