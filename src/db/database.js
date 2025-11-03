import mongoose from "mongoose";

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      tlsAllowInvalidCertificates: true,
    });
    console.log("Connected to database successfully");
  } catch (error) {
    console.log("Error connecting to database:", error);
    process.exit(1);
  }
};

export default connectDB;
