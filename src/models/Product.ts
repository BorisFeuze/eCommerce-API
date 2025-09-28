import { Schema, model } from 'mongoose';

const productSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'name is required'],
      trim: true
    },
    description: {
      type: String,
      required: [true, 'description is required'],
      trim: true
    },
    price: {
      type: Number,
      required: [true, 'price is required']
    },
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'category',
      required: [true, 'category ID is required']
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

const Product = model('product', productSchema);

export default Product;
