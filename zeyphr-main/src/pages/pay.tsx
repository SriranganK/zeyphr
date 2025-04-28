import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";

const Pay = () => {
  const [contact, setContact] = useState<string>("");
  const [amount, setAmount] = useState<number | string>("");
  const [isPaid, setIsPaid] = useState(false);

  const router = useRouter();

  // Extract the query parameters on page load
  useEffect(() => {
    const { email, amount } = router.query;
    if (email) setContact(email as string); // Setting email from URL
    if (amount) setAmount(amount as string); // Setting amount from URL
  }, [router.query]);

  const handlePay = async() => {
    if (!contact || !amount || isNaN(Number(amount))) {
      alert("Please enter a valid contact and amount.");
      return;
    }
    const response = await fetch("/api/pay", {
      method: "POST",
      body: JSON.stringify({ email:contact, amount }),
      headers: {
        "Content-Type": "application/json",
      }, 
    })
    if (response.status) {
      setIsPaid(true)
    }
  };

  if (isPaid) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f0fdf4",
          padding: "20px",
        }}
      >
        <div
          style={{
            backgroundColor: "#34d399",
            padding: "20px 40px",
            borderRadius: "999px",
            marginBottom: "20px",
          }}
        >
          <span style={{ fontSize: "48px", color: "white" }}>✅</span>
        </div>
        <h1 style={{ fontSize: "28px", fontWeight: "bold", color: "#065f46" }}>
          Payment Successful!
        </h1>
        <p style={{ marginTop: "10px", fontSize: "18px", color: "#065f46" }}>
          You sent ₹{amount} to {contact}.
        </p>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "450px",
        margin: "0 auto",
        padding: "20px",
        minHeight: "100vh",
        background: "#f9fafb",
        display: "flex",
        flexDirection: "column",
      }}
    >
      <h2
        style={{
          fontSize: "28px",
          fontWeight: "bold",
          marginBottom: "24px",
          textAlign: "center",
          color: "#111827",
        }}
      >
        Send Money
      </h2>

      {/* Email Address Input */}
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "16px",
            fontWeight: "600",
            color: "#374151",
          }}
        >
          Email address or Public Key
        </label>
        <input
          type="text"
          placeholder="example@email.com or 0x123..."
          value={contact}
          onChange={(e) => setContact(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            outline: "none",
            fontSize: "16px",
          }}
        />
      </div>

      {/* Amount Input */}
      <div style={{ marginBottom: "20px" }}>
        <label
          style={{
            display: "block",
            marginBottom: "8px",
            fontSize: "16px",
            fontWeight: "600",
            color: "#374151",
          }}
        >
          Amount (₹)
        </label>
        <input
          type="number"
          placeholder="Enter amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #d1d5db",
            outline: "none",
            fontSize: "16px",
          }}
        />
      </div>

      {/* Review Section */}
      {contact && amount && (
        <div
          style={{
            backgroundColor: "#e0f2fe",
            padding: "16px",
            borderRadius: "10px",
            marginBottom: "24px",
          }}
        >
          <p style={{ margin: "0 0 8px", color: "#0369a1", fontWeight: "500" }}>
            Sending To: <span style={{ fontWeight: "700" }}>{contact}</span>
          </p>
          <p style={{ margin: 0, color: "#0369a1", fontWeight: "500" }}>
            Amount: <span style={{ fontWeight: "700" }}>₹{amount}</span>
          </p>
        </div>
      )}

      {/* Pay Button */}
      <button
        onClick={handlePay}
        style={{
          width: "100%",
          padding: "14px",
          backgroundColor: "#3b82f6",
          color: "white",
          border: "none",
          borderRadius: "8px",
          fontSize: "18px",
          fontWeight: "600",
          cursor: "pointer",
          transition: "background 0.3s",
        }}
      >
        Pay Now
      </button>
    </div>
  );
};

export default Pay;
