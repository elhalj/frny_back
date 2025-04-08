import mongoose from "mongoose";

export async function _connectDb() {
  try {
    const _connect = await mongoose.connect(process.env.MONGO_URI);
    console.log(`connecte a ${_connect.connection.host}`);
  } catch (error) {
    console.error(error);
    process.exit(10);
  }
}
