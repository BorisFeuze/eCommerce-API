import { User } from '#models';
import type { RequestHandler } from 'express';
import { isValidObjectId } from 'mongoose';
import type { z } from 'zod/v4';
import { userSchema, userInputSchema } from '#schemas';

type UserInputDTO = z.infer<typeof userInputSchema>;
type UserDTO = z.infer<typeof userSchema>;

const getUsers: RequestHandler<{}, UserDTO[]> = async (req, res) => {
  const users = await User.find().lean();
  res.json(users);
};

const createUser: RequestHandler<{}, UserDTO, UserInputDTO> = async (req, res) => {
  const { email } = req.body;

  const found = await User.findOne({ email });
  if (found) {
    throw new Error('User already exists', { cause: { status: 400 } });
  }
  const user = await User.create(req.body);
  res.json(user);
};

const getUserById: RequestHandler<{ id: string }, UserDTO> = async (req, res) => {
  const {
    params: { id }
  } = req;

  if (!isValidObjectId(id)) {
    throw new Error('Invalid ID', { cause: { status: 400 } });
  }

  const user = await User.findById(id);
  if (!user) {
    throw new Error('User not found', { cause: { status: 404 } });
  }
  res.json(user);
};

const updateUser: RequestHandler<{ id: string }, UserDTO, UserInputDTO> = async (req, res) => {
  const {
    body,
    params: { id }
  } = req;
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

  res.json(user);
};

const deleteUser: RequestHandler<{ id: string }, { message: string }> = async (req, res) => {
  const {
    params: { id }
  } = req;

  if (!isValidObjectId(id)) {
    throw new Error('Invalid ID', { cause: { status: 400 } });
  }

  const user = await User.findByIdAndDelete(id);
  if (!user) {
    throw new Error('User not found', { cause: { status: 404 } });
  }
  res.json({ message: 'User deleted' });
};

export { getUsers, getUserById, createUser, updateUser, deleteUser };
