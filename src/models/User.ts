import { Schema, model } from 'mongoose';
import { required } from 'zod/v4-mini';

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      match: [/^\S+@\S+\.\S+$/, 'Email is not valid']
    },
    password: {
      type: String,
      minlength: [6, 'Password must be at least 6 characters long']
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

const User = model('user', userSchema);

export default User;
