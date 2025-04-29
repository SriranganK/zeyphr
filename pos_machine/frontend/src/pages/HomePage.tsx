import React, { useState } from "react";
import "./styles/style.css";
import { useNavigate } from "react-router-dom";

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false); // State to manage the dropdown menu

  // Function to toggle the dropdown menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <div className="home-fullscreen">
      {/* Mobile Nav Icon */}
      <div className="mobile-nav-icon" onClick={toggleMenu}>
        ☰ {/* Hamburger icon */}
      </div>

      {/* Dropdown Menu */}
      {isMenuOpen && (
        <div className="dropdown-menu">
          {/* <button
            className="dropdown-item"
            onClick={() => {
              navigate("/transaction-history");
              setIsMenuOpen(false); // Close the menu after navigation
            }}
          >
            Transaction History
          </button> */}
          <button
            className="dropdown-item"
            onClick={() => {
              navigate("/");
              setIsMenuOpen(false); // Close the menu after navigation
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
        <p className="powered-by">Powered by</p>
        <img src="/iota-logo.png" alt="IOTA" className="iota-logo" />
      </div>
    </div>
  );
};

export default HomePage;
