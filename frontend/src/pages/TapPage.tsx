import React, { useEffect, useState } from "react";
import "./styles/style.css";
import "./styles/tap.css";
import { useLocation, useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import axios from "axios";

const socket = io("http://localhost:5000"); // Use your deployed URL if needed

const TapPage: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(120);
  const [showTimeout, setShowTimeout] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const amount = location.state?.amount ?? 0;

    const handleClose = () => {
      navigate("/"); // Navigate to the scan page
    };

  useEffect(() => {
    const handleNFC = async (data: { pubkey: string }) => {
      console.log("Received public key:", data.pubkey);

      try {
        const response = await axios.post(
          "http://localhost:5000/api/newtransaction",
          {
            pubkey: data.pubkey,
            amount: amount,
          }
        );
        console.log(response)
        if (response.status === 200) {
          navigate("/success");
        } else {
          navigate("/failure");
        }
      } catch (error) {
        console.error("Error processing transaction:", error);
        navigate("/failure");
      }
    };

    socket.on("listen-nfc", handleNFC);
    return () => {
      socket.off("listen-nfc", handleNFC);
    };
  }, [amount, navigate]);

  // Countdown timer logic
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else {
      setShowTimeout(true);
    }
  }, [timeLeft]);

  return (
    <div className="home-fullscreen">
      <img src="/zeyphr.png" alt="Zeyphr Logo" className="logo" />
      <button className="close-icon" onClick={handleClose}>
        ✕
      </button>
      <div className="tap-instruction">
        {showTimeout ? (
          <h2>Time's Up! Please Try Again</h2>
        ) : (
          <>
            <div className="tap-icon">
              <img src="/tap.png" alt="Tap Icon" />
            </div>
            <div style={{ color: "black" }}>
              <h2>Tap the Machine</h2>
              <div className="tap-amount">Amount: ${amount}</div>
              <div className="tap-timer">Time Left: {timeLeft}s</div>
            </div>
          </>
        )}
      </div>

      <div className="footer">
        <p className="powered-by">Powered by</p>
        <img src="/iota-logo.png" alt="IOTA" className="iota-logo" />
      </div>
    </div>
  );
};

export default TapPage;
