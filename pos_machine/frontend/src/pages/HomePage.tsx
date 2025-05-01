import React, { useState, useEffect } from "react";
import "./styles/style.css";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [merchantEmail, setMerchantEmail] = useState<string | null>(null);

  useEffect(() => {
    const email = localStorage.getItem("merchant_email");
    setMerchantEmail(email);
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    localStorage.removeItem("m_publicKey");
    localStorage.removeItem("jwt_token");
    localStorage.removeItem("merchant_email");
    navigate("/");
  };

  return (
    <div className="home-fullscreen">
      {/* Mobile Nav Icon */}
      <div className="mobile-nav-icon" onClick={toggleMenu}>
        ☰
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="dropdown-menu">
          {merchantEmail && (
            <div className="dropdown-email">
              Signed in as<br /><strong>{merchantEmail}</strong>
            </div>
          )}
          <button
            className="dropdown-item"
            onClick={() => {
              setIsMenuOpen(false);
              handleLogout();
            }}
          >
            Sign Out
          </button>
        </div>
      )}

      {/* Logo and Main Content */}
      <img src="/zeyphr.png" alt="Zeyphr Logo" className="logo" />
      <p className="pay-with-text">Pay with</p>

      {/* Tap Button */}
      <button
        className="pay-button"
        onClick={() => navigate("/amount", { state: { method: "tap" } })}
      >
        <img src="/tap.png" alt="TAP" className="icon" />
        <span>TAP</span>
      </button>

      {/* Scan Button */}
      <button
        className="pay-button"
        onClick={() => navigate("/amount", { state: { method: "scan" } })}
      >
        <img src="/scan.png" alt="SCAN" className="icon" />
        <span>SCAN</span>
      </button>

      <div className="footer">
        <img src="/iota-logo.png" alt="IOTA" className="iota-logo" />
      </div>
    </div>
  );
};

export default HomePage;
