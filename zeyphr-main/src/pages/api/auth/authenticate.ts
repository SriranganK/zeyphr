import { NextApiRequest, NextApiResponse } from "next";
import jwt from "jsonwebtoken";
import { verifyMessage } from "ethers";
import dbConnect from "@/lib/dbConnect";
import User from "@/models/User";
import { nonces } from "./nonce"; // Import shared nonce storage

const JWT_SECRET = process.env.JWT_SECRET!;

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== "POST") return res.status(405).end("Method not allowed");

  const { walletAddress, signature } = req.body;
  const nonce = nonces[walletAddress];

  if (!nonce) return res.status(400).json({ error: "Nonce not found" });

  try {
    const recovered = verifyMessage(nonce, signature);
    if (recovered.toLowerCase() !== walletAddress.toLowerCase()) {
      return res.status(401).json({ error: "Invalid signature" });
    }

    await dbConnect();

    let user = await User.findOne({ walletAddress });
    if (!user) user = await User.create({ walletAddress });

    const token = jwt.sign({ walletAddress }, JWT_SECRET, { expiresIn: "1h" });
    delete nonces[walletAddress];

    res.status(200).json({ token });
  } catch (err) {
    res.status(400).json({ error: "Signature verification failed" });
  }
}
