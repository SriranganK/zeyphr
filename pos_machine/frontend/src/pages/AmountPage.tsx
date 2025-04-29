import React, { useState } from "react";
import "./styles/amount.css";
import { useLocation, useNavigate } from "react-router-dom";

const AmountPage: React.FC = () => {
  const [amount, setAmount] = useState("");
  const navigate = useNavigate();
  const location = useLocation();
  const method = location.state?.method; // "tap" or "scan"

  const handleKeyPress = (key: string) => {
    if (key === "⌫") {
      setAmount((prev) => prev.slice(0, -1));
    } else if (key === "." && amount.includes(".")) {
      return;
    } else if (/^\d$/.test(key) || key === ".") {
      if (/^\d*\.?\d{0,2}$/.test(amount + key)) {
        setAmount((prev) => prev + key);
      }
    }
  };

  const handleSubmit = () => {
    if (!amount) return;
    if (method === "tap") {
      navigate("/tap", { state: { amount } });
    } else if (method === "scan") {
      navigate("/scan", { state: { amount } });
    }
  };

  const handleClose = () => {
    navigate("/"); // Navigate to the scan page
  };

  const keypadKeys = [
    "1",
    "2",
    "3",
    "4",
    "5",
    "6",
    "7",
    "8",
    "9",
    ".",
    "0",
    "⌫",
  ];

  return (
    <div className="amount-page">
      {/* Close Icon */}
      <button className="close-icon" onClick={handleClose}>
        ✕
      </button>

      <div className="avatar">M</div> {/* Move this outside header */}
      <div className="header">
        <div className="paying-text">Paying Bank Name</div>
      </div>
      <div className="amount-section">
        <div className="amount-container">
          <div className="main-amount">{amount || "0"}</div>
        </div>
      </div>
      <div>
        <button className="fab" onClick={handleSubmit}>
          ➔
        </button>
      </div>
      <div className="keypad">
        {keypadKeys.map((key) => (
          <button key={key} className="key" onClick={() => handleKeyPress(key)}>
            {key}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AmountPage;