import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true },
  walletAddress: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.models.User || mongoose.model("User", UserSchema);
