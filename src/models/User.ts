import { Schema, model } from 'mongoose';

const userSchema = new Schema(
  {
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
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
