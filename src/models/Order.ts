import { Schema, model } from 'mongoose';

const orderSchema = new Schema(
  {
    userId: {
      type: Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'user ID is required']
    },
    products: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: 'Product',
          required: [true, 'product ID is required']
        }
      },
      {
        quantity: {
          type: Number,
          required: [true, 'quantity of product is required']
        }
      }
    ],

    total: {
      type: Number
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: true }
  }
);

const Order = model('order', orderSchema);

export default Order;
