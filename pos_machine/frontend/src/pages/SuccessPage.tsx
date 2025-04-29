import React, { useEffect, useState } from "react";
import Confetti from "react-confetti";
import "./styles/style.css";
import "./styles/success_failure.css";
import { useNavigate } from "react-router-dom";

const SuccessPage: React.FC = () => {
  const [showConfetti, setShowConfetti] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const timeout = setTimeout(() => setShowConfetti(false), 5000); // Stop after 5s
    return () => clearTimeout(timeout);
  }, []);

  return (
    <div className="home-fullscreen success-page">
      {showConfetti && <Confetti numberOfPieces={300} recycle={false} />}

      <img src="/zeyphr.png" alt="Zeyphr Logo" className="logo" />

      <div className="jumping-tick">✅</div>

      <h2 className="success-message">Payment Successful!</h2>
      <button className="close-icon" onClick={()=> navigate("/homepage")}>
      x
      </button>
      <div className="footer">
        <p className="powered-by">Powered by</p>
        <img src="/iota-logo.png" alt="IOTA" className="iota-logo" />
      </div>
    </div>
  );
};

export default SuccessPage;
