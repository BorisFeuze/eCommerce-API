import { createUser, deleteUser, getUserById, getUsers, updateUser } from '#controllers';
import { Router } from 'express';
import { validateZod } from '#middleware';
import { userInputSchema, paramSchema } from '#schemas';

const usersRouter = Router();

usersRouter.route('/').get(getUsers).post(validateZod(userInputSchema, 'body'), createUser);
usersRouter.use('/:id', validateZod(paramSchema, 'params'));
usersRouter.route('/:id').get(getUserById).put(validateZod(userInputSchema, 'body'), updateUser).delete(deleteUser);

export default usersRouter;
