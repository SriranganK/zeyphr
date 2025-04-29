import React, { useEffect, useState } from "react";
import QRCode from "react-qr-code";
import "./styles/style.css";
import "./styles/qr.css";
import { useLocation, useNavigate } from "react-router-dom";
// import { io } from "socket.io-client";


// const socket = io('http://localhost:5000'); // Replace with actual backend URL if deployed

const QrPage: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const amount = location.state?.amount;
    const [secondsLeft, setSecondsLeft] = useState(120); // 2 minutes
    const qrValue = `iota://pay?pub=hgccchgvycd62261617v1hvfvytftyftyf16625r67rifdyfe&pn=GroceryShop&am=${amount}&cu=INR`;


      // useEffect(() => {
      //   socket.on("listen-scan", (data) => {
      //     console.log("Received public key:", data.pubkey);
      //     navigate("/success");
      //     // Do something with the public key here
      //   });
    
      //   return () => {
      //     socket.off("listen-nfc");
      //   };
      // }, []);
    
    
  useEffect(() => {
    const timer = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          console.log("/timeout"); // Redirect on timeout
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer); // Clean up
  }, []);

  const formatTime = (seconds: number): string => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

    const handleClose = () => {
      navigate("/"); // Navigate to the scan page
    };

  return (
    <div className="home-fullscreen">
      <button className="close-icon" onClick={handleClose}>
        ✕
      </button>
      <img src="/zeyphr.png" alt="Zeyphr Logo" className="logo" />

      <div className="qr-instruction">Scan to Pay</div>

      <QRCode value={qrValue} size={220} />

      <div className="qr-amount">{amount}</div>

      {/* Countdown Display */}
      <div className="qr-timer">QR expires in: {formatTime(secondsLeft)}</div>

      <div className="footer">
        <p className="powered-by">Powered by</p>
        <img src="/iota-logo.png" alt="IOTA" className="iota-logo" />
      </div>
    </div>
  );
};

export default QrPage;
