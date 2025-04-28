import type { NextApiRequest, NextApiResponse } from "next";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { transferEther } from "@/utils/transfer";
import { ethers } from "ethers";

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end("Method Not Allowed");

  const { email, amount } = req.body;

  try {
    await dbConnect();

    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ error: "Invalid credentials" });
    console.log(user);
    const {walletAddress} = user
    console.log(walletAddress,amount);
    const recipt =  transferEther(walletAddress,amount);
    res.status(200).send(recipt);
  } catch (err) {
    res.status(500).json({ error: "Server error" });
  }
}
