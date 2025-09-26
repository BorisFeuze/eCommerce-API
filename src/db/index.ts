import mongoose from 'mongoose';
try {
  await mongoose.connect(process.env.LOCAL_URI!, { dbName: 'eCommerce-API' });
  console.log('\x1b[35mMongoDB connected via Mongoose\x1b[0m');
} catch (error) {
  const errorMessage = error instanceof Error ? error.stack : 'something went wrong with Mangoose connection';
  console.log(`\x1b[31mMongoDB connection error, ${errorMessage}\x1b[0m`);
}
