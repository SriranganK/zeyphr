import React, { useEffect, useState } from "react";
import "./styles/style.css";
import "./styles/tap.css";
import { useLocation, useNavigate } from "react-router-dom";

const TapPage: React.FC = () => {
  const [timeLeft, setTimeLeft] = useState(60);
  const [showTimeout, setShowTimeout] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const amount = location.state?.amount ?? 0;

  const handleClose = () => {
    navigate("/"); // Navigate to the scan page
  };

  useEffect(() => {
    const handleNFC = async (amount: number) => {
      try {
        const res = await fetch("/api/read-card");
        const resData = await res.json();
        console.log("response_read_card:", resData);

        if (resData.status === "card_detected") {
          navigate("/processing");

          const response = await fetch(`${import.meta.env.VITE_ZEYPHR_URL}/api/transaction/new`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
            },
            body: JSON.stringify({
              publicKey: resData.pub_key,
              privateKey: resData.priv_key,
              amount: amount,
              merchantPublicKey: localStorage.getItem("m_publicKey"),
            }),
          });
          const data = await response.json();
          if (response.status === 200) {
            
            navigate("/success", {
              state: {
                to: data.userEmail,
                amount: `${data.amount} ETH`
              }
            });
            
          }
           else {
            
            navigate("/failure", { 
              state: { 
                message: data.error, 
              } 
            });
          }
        } else if (
          resData.status === "no_card_detected" ||
          resData.status === "read_error"
        ) {
          navigate("/failure");
        }
      } catch (error) {
        console.error("Error processing transaction:", error);
        navigate("/failure");
      }
    };

    handleNFC(amount);
  }, [amount]);

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
        <img src="/iota-logo.png" alt="IOTA" className="iota-logo" />
      </div>
    </div>
  );
};

export default TapPage;
