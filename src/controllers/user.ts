import { User } from '#models';
import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import type { z } from 'zod/v4';
import { userSchema, userInputSchema } from '#schemas';

type UserInputDTO = z.infer<typeof userInputSchema>;
type UserDTO = z.infer<typeof userSchema>;

const getUsers: RequestHandler<{}, UserDTO[]> = async (request, response) => {
  const users = await User.find().lean();
  response.json(users);
};

const createUser: RequestHandler<{}, UserDTO, UserInputDTO> = async (request, response) => {
  const { email } = request.body;

  const found = await User.findOne({ email });
  if (found) {
    throw new Error('User already exists', { cause: { status: 400 } });
  }
  const user = await User.create(request.body);
  response.json(user);
};

const getUserById: RequestHandler<{ id: string }, UserDTO> = async (request, response) => {
  const {
    params: { id }
  } = request;

  if (!isValidObjectId(id)) {
    throw new Error('Invalid ID', { cause: { status: 400 } });
  }

  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found', { cause: { status: 404 } });
  }
  response.json(user);
};

const updateUser: RequestHandler<{ id: string }, UserDTO, UserInputDTO> = async (request, response) => {
  const {
    body,
    params: { id }
  } = request;
  const { email, password } = body;

  if (!isValidObjectId(id)) {
    throw new Error('Invalid ID', { cause: { status: 400 } });
  }

  const user = await User.findById(id);

  if (!user) {
    throw new Error('User not found', { cause: { status: 404 } });
  }
  // user.firstName = firstName;
  // user.lastName = lastName;
  user.email = email;
  user.password = password;

  await user.save();

  response.json(user);
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
