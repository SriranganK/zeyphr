// src/pages/api/register.ts
import { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import mongoose from "mongoose";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { email, password, walletAddress } = req.body;

  try {
    await dbConnect();

    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ error: "User already exists" });

    const passwordHash = await bcrypt.hash(password, 10);
    const userId = new mongoose.Types.ObjectId().toString();

    const user = new User({ email, passwordHash, walletAddress, userId });
    await user.save();

    res.status(201).json({ user: user });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
}
