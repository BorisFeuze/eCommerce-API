// import { createUser, deleteUser, getUserById, getUsers, updateUser } from '#controllers';
import { Router } from 'express';
// import { validateZod } from '#middleware';
// import { userInputSchema, updateUserSchema } from '#schemas';

const usersRouter = Router();

// usersRouter.route('/').get(getUsers).post(validateZod(userInputSchema), createUser);
// usersRouter.route('/:id').get(getUserById).put(validateZod(updateUserSchema), updateUser).delete(deleteUser);

export default usersRouter;
