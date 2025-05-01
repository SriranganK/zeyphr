import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/login.css";
import {jwtDecode} from "jwt-decode";

type Decode = {
  publicKey: string;
};

const LoginPage: React.FC = () => {
  const navigate = useNavigate();

  const [emailAddress, setemailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(""); // Clear previous error

    try {
      const response = await fetch(`${import.meta.env.VITE_ZEYPHR_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({emailAddress, password }),
      });

      if (response.status === 200) {
        const data = await response.json();
        
        const decodedRaw = jwtDecode(data.token) as Decode;
        localStorage.setItem("jwt_token", data.token);
      
        if (!decodedRaw){
          setErrorMessage("Invalid token structure. Please try again.");
          return;
        }
        
        console.log("Decoded JWT:", decodedRaw);

        localStorage.setItem("m_publicKey", decodedRaw.publicKey);
        localStorage.setItem("merchant_email", emailAddress);
        navigate("/homepage");
      } else {
        setErrorMessage("Invalid credentials. Please try again.");
      }
    } catch (error) {
      console.error("Login Error:", error);
      setErrorMessage("Something went wrong. Please try later.");
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <img src="/zeyphr.png" alt="Zeyphr Logo" className="login-logo" />
        <h2 className="login-title">Welcome Back!</h2>

        <form className="login-form" onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Email"
            className="login-input"
            value={emailAddress}
            onChange={(e) => setemailAddress(e.target.value)}
          />

          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              className="login-input password-input"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div className="toggle-password" onClick={togglePassword}>
              {showPassword ? (
                // Eye Open Icon
                <svg xmlns="http://www.w3.org/2000/svg" className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1.5 12s4-7 10.5-7 10.5 7 10.5 7-4 7-10.5 7S1.5 12 1.5 12z" />
                  <circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="2" />
                </svg>
              ) : (
                // Eye Off Icon
                <svg xmlns="http://www.w3.org/2000/svg" className="eye-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.94 17.94A10.94 10.94 0 0112 19c-5.25 0-9.69-3.22-11.44-8a10.94 10.94 0 012.88-4.14M1 1l22 22M9.88 9.88a3 3 0 104.24 4.24" />
                </svg>
              )}
            </div>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>

          {errorMessage && <div className="error-message">{errorMessage}</div>}
        </form>

        <p className="login-footer">Powered by IOTA</p>
      </div>
    </div>
  );
};

export default LoginPage;
