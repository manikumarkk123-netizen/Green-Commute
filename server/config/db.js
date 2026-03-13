import mongoose from 'mongoose';

let isConnected = false;

const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/greencommute';
    const conn = await mongoose.connect(uri);
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    isConnected = false;
    console.error(`MongoDB Connection Error: ${error.message}`);
    console.warn('Server will run without database (mock mode)');
  }
};

export const getIsConnected = () => isConnected;
export default connectDB;
