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
    categoryId: {
      type: Schema.Types.ObjectId,
      ref: 'Category',
      required: [true, 'category ID is required']
    }
  },
  {
    timestamps: { createdAt: true, updatedAt: false }
  }
);

const Product = model('product', productSchema);

export default Product;
