import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { UserRouter } from './controllers/UserController.js';

dotenv.config();

const app = express();

// Middleware to parse JSON
app.use(express.json());

// Connect to MongoDB
const db = mongoose.connect(process.env.MONGO_URI)
try {
    if(db){
        console.log("database connected");
    }
} catch (error) {
    console.log(error);
}

// Routes
app.use('/api/auth', UserRouter);

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
