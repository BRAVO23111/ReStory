import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

(async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');
    process.exit(0); // Exit after success
  } catch (error) {
    console.error('Error connecting to MongoDB:', error);
    process.exit(1); // Exit after failure
  }
})();
