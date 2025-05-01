import React, { useEffect, useRef, useState } from "react";
import QRCode from "react-qr-code";
import { useLocation, useNavigate } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";
import "./styles/qr.css";

const QrPage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const amount = location.state?.amount;

  const [secondsLeft, setSecondsLeft] = useState(120); // 2 minutes
  const [transactionID] = useState(uuidv4());
  const [transactionInitialized, setTransactionInitialized] = useState(false);

  const publicKey = localStorage.getItem("m_publicKey");
  const qrValue = `zeyphr://qrpay?pub=${publicKey}&am=${amount}&tx=${transactionID}`;

  const pollIntervalRef = useRef<number | null>(null);
  const countdownRef = useRef<number | null>(null);

  // Step 1: POST /scan/new
  useEffect(() => {
    fetch(`${import.meta.env.VITE_ZEYPHR_URL}/api/transaction/scan/new`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
      body: JSON.stringify({ transactionID }),
    })
      .then((res) => {
        if (!res.ok) throw new Error("Failed to initialize transaction");
        setTransactionInitialized(true); // only mark initialized on success
      })
      .catch((error) => {
        console.error("Init error:", error);
        navigate("/failure", {
          state: { message: "Failed to initialize transaction" },
        });
      });
  }, [transactionID, navigate]);

  // Step 2: Start polling
  useEffect(() => {
    pollIntervalRef.current = window.setInterval(async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_ZEYPHR_URL}/api/transaction/status/`
        , {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },body: JSON.stringify({ transactionID }),
        }
        )
        const data = await response.json();
        if (response.status === 200) {
          if (data.status === "pending") {
            // Do nothing, just keep polling
          } else if (data.status === "cancelled") {
            cleanupTimers();
            cancelTransaction();
            navigate("/failure", { state: { message: "Cancelled" } });
          } else if (data.status === "timeout") {
            cleanupTimers();
            cancelTransaction();
            navigate("/failure", { state: { message: "Timeout" } });
          }
         else if (data.status === "success") {
            navigate("/success");
            cleanupTimers();
        } else if (data.status === "failure") {
          cleanupTimers();
          navigate("/failure", {
            state: { message: data.message },
          });
        }
      } }
      catch (err) {
        console.error("Polling error:", err);
      }
    }, 2000);

    return () => cleanupTimers();
  }, [transactionID, navigate]);

  // Step 3: Countdown timer
  useEffect(() => {
    countdownRef.current = window.setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          cleanupTimers();
          cancelTransaction();
          navigate("/failure", { state: { message: "Timeout" } });
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => cleanupTimers();
  }, [navigate]);

  // Cleanup intervals
  const cleanupTimers = () => {
    if (pollIntervalRef.current !== null) clearInterval(pollIntervalRef.current);
    if (countdownRef.current !== null) clearInterval(countdownRef.current);
  };

  // Cancel transaction if it was initialized
  const cancelTransaction = () => {
    if (!transactionInitialized) return;
    fetch(`${import.meta.env.VITE_ZEYPHR_URL}/api/transaction/delete`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
      },
      body: JSON.stringify({ transactionID }),
    }).catch((err) => console.error("Error cancelling transaction:", err));
  };

  // When ✕ is clicked
  const handleClose = () => {
    cleanupTimers();
    cancelTransaction();
    navigate("/homepage");
  };

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="home-fullscreen">
      <button className="close-icon" onClick={handleClose}>
        ✕
      </button>

      <img src="/zeyphr.png" alt="Zeyphr Logo" className="logo" />

      <div className="qr-instruction">Scan to Pay</div>

      <QRCode value={qrValue} size={220} />

      <div className="qr-amount"><strong>Amount:</strong> {amount} ETH</div>

      <div className="qr-timer">QR expires in: {formatTime(secondsLeft)}</div>

      <div className="footer">
        <img src="/iota-logo.png" alt="IOTA" className="iota-logo" />
      </div>
    </div>
  );
};

export default QrPage;
