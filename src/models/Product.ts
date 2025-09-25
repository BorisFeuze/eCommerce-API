import { Schema, model } from 'mongoose';

const productSchema = new Schema(
  // {
  //   title: {
  //     type: String,
  //     required: [true, 'Title is required'],
  //     trim: true
  //   },
  //   content: {
  //     type: String,
  //     required: [true, 'Content is required'],
  //     trim: true
  //   },
  //   userId: {
  //     type: Schema.Types.ObjectId,
  //     ref: 'User',
  //     required: [true, 'User ID is required']
  //   }
  // },
  {
    timestamps: true
  }
);

const Product = model('Product', productSchema);

export default Product;
