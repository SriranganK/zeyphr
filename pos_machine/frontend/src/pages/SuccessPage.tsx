import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import "./styles/style.css";
import "./styles/success_failure.css";
import { useNavigate, useLocation } from "react-router-dom";

const SuccessPage: React.FC = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();
  
  const to = location.state?.to || "N/A";
  const amount = location.state?.amount || "N/A";

  useEffect(() => {
    const timeout = setTimeout(() => setShowConfetti(false), 5000);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="home-fullscreen success-page">
      {showConfetti && <Confetti numberOfPieces={300} recycle={false} />}

      <button className="close-icon" onClick={() => navigate("/homepage")}>
        ✕
      </button>

      <img src="/zeyphr.png" alt="Zeyphr Logo" className="logo" />

      <div className="center-content">
        <div className="jumping-tick">✅</div>
        <h2 className="success-message">Payment Successful!</h2>

        <div className="transaction-info">
        <div className="transaction-box">
          <p><strong>Received From:</strong> {to}</p>
          <p><strong>Amount:</strong> {amount}</p>
        </div>

        </div>
      </div>

      <div className="footer">
        <img src="/iota-logo.png" alt="IOTA" className="iota-logo" />
      </div>
    </div>
  );
};

export default SuccessPage;
