"use client";

import { useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/navigation";
import MnemonicInput from "@/pages/MnemonicInput";

const Login = () => {
  const [loginMode, setLoginMode] = useState<"privateKey" | "mnemonic">(
    "privateKey"
  );
  const [privateKey, setPrivateKey] = useState("");
  const [message, setMessage] = useState("");
  const router = useRouter();
  const handleLoginWithPrivateKey = async () => {
    try {
      const wallet = new ethers.Wallet(privateKey);
      const address = await wallet.getAddress();

      const nonceRes = await fetch(`/api/auth/nonce`,{
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({walletAddress: address }),
      });
      const nonceData = await nonceRes.json();

      const signature = await wallet.signMessage(nonceData.nonce);

      const authRes = await fetch("/api/auth/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress:address, signature }),
      });

      const authData = await authRes.json();

      if (!authRes.ok) throw new Error(authData.message || "Login failed");

      localStorage.setItem("token", authData.token);
      localStorage.setItem("walletAddress", address);
      localStorage.setItem("privateKey", privateKey);

      router.push("/");
    } catch (err: any) {
      setMessage(`❌ ${err.message || "Login failed"}`);
    }
  };

  const handleMnemonicSubmit = async (mnemonic: string) => {
    try {
      const hdNode = ethers.HDNodeWallet.fromPhrase(mnemonic);
      const wallet = new ethers.Wallet(hdNode.privateKey);
      const address = await wallet.getAddress();

      const nonceRes = await fetch(`/api/nonce?address=${address}`);
      const nonceData = await nonceRes.json();

      const signature = await wallet.signMessage(nonceData.nonce);

      const authRes = await fetch("/api/authenticate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ address, signature }),
      });

      const authData = await authRes.json();

      if (!authRes.ok) throw new Error(authData.message || "Login failed");

      localStorage.setItem("token", authData.token);
      localStorage.setItem("walletAddress", address);
      localStorage.setItem("privateKey", wallet.privateKey);

      router.push("/");
    } catch (err: any) {
      setMessage(`❌ ${err.message || "Invalid mnemonic or login failed."}`);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600, margin: "0 auto" }}>
      <h2>🔐 Login with Wallet</h2>

      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setLoginMode("privateKey")}
          style={{
            marginRight: 10,
            padding: 10,
            backgroundColor: loginMode === "privateKey" ? "#007bff" : "#ccc",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          🔑 Private Key
        </button>
        <button
          onClick={() => setLoginMode("mnemonic")}
          style={{
            padding: 10,
            backgroundColor: loginMode === "mnemonic" ? "#007bff" : "#ccc",
            color: "#fff",
            border: "none",
            borderRadius: 5,
            cursor: "pointer",
          }}
        >
          🧠 Mnemonic
        </button>
      </div>

      {loginMode === "privateKey" ? (
        <div>
          <input
            type="password"
            value={privateKey}
            onChange={(e) => setPrivateKey(e.target.value)}
            placeholder="Enter your private key"
            style={{ width: "100%", padding: 10, marginBottom: 10 }}
          />
          <button onClick={handleLoginWithPrivateKey}>🚀 Login</button>
        </div>
      ) : (
        <MnemonicInput onSubmit={handleMnemonicSubmit} />
      )}

      <p style={{ marginTop: 20 }}>
        Don’t have a wallet? <a href="/signup">Create one</a>
      </p>
      {message && <p style={{ color: "red" }}>{message}</p>}
    </div>
  );
};

export default Login;
