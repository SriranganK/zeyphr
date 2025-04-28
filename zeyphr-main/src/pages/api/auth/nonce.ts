import { NextApiRequest, NextApiResponse } from "next";

const nonces: Record<string, string> = {};

export default function handler(req: NextApiRequest, res: NextApiResponse) {

  const { walletAddress } = req.body;
  if (!walletAddress)
    return res.status(400).json({ error: "Wallet address required" });

  const nonce = Math.floor(Math.random() * 1000000).toString();
  nonces[walletAddress] = nonce;

  res.status(200).json({ nonce });
}

export { nonces }; // Exporting for shared use in authenticate route
