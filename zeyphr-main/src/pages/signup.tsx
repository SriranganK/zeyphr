import { useState } from "react";
import { ethers } from "ethers";
import { useRouter } from "next/router";

export default function Signup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mnemonic, setMnemonic] = useState("");
  const [address, setAddress] = useState("");
  const [privateKey, setPrivateKey] = useState("");
  const [walletGenerated, setWalletGenerated] = useState(false);

  const router = useRouter();

  const createWallet = async () => {
    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }
    try {
      const wallet :any = ethers.Wallet.createRandom();
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          walletAddress: wallet.address,
        }),
      });

      const result = await res.json();
      if (!res.ok) throw new Error(result.message);

      setMnemonic(wallet.mnemonic.phrase);
      setAddress(wallet.address);
      setPrivateKey(wallet.privateKey);
      setWalletGenerated(true);
    } catch (err: any) {
      alert("❌ Registration failed: " + err.message);
    }
  };

  const downloadWallet = () => {
    const blob = new Blob(
      [
        JSON.stringify(
          { email, password, address, privateKey, mnemonic },
          null,
          2
        ),
      ],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `wallet_${address}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleLogin = () => {
    localStorage.setItem("walletAddress", address);
    localStorage.setItem("privateKey", privateKey);
    router.push("/");
  };

  return (
    <div style={{ padding: 20 }}>
      <h2>🪙 Create New Wallet</h2>

      <input
        type="email"
        value={email}
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <input
        type="password"
        value={password}
        placeholder="Password"
        onChange={(e) => setPassword(e.target.value)}
        style={{ display: "block", marginBottom: 10 }}
      />

      <button onClick={createWallet}>Generate Wallet</button>

      {walletGenerated && (
        <div style={{ marginTop: 20 }}>
          <p>
            <strong>Mnemonic:</strong> {mnemonic}
          </p>
          <p>
            <strong>Address:</strong> {address}
          </p>
          <p>
            <strong>Private Key:</strong> {privateKey}
          </p>
          <p>
            ⚠️ Save this info securely. It’s the only way to recover your
            wallet.
          </p>

          <button onClick={downloadWallet} style={{ marginRight: 10 }}>
            ⬇️ Download Wallet Info
          </button>

          <button onClick={handleLogin}>🚀 Login to Marketplace</button>
        </div>
      )}
    </div>
  );
}
