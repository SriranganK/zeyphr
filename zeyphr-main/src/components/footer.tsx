import React from "react";

const Footer = () => {
  return (
    <footer
      style={{
        backgroundColor: "#000000",
        color: "#ffffff",
        padding: "30px",
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap",
      }}
    >
      {/* Left Side - Zeyphr Logo */}
      <div style={{ flex: "1", display: "flex", justifyContent: "center" }}>
        <img
          src="/zeyphr_white.png" // replace with your logo path
          alt="Zeyphr Logo"
          style={{ height: "50px", objectFit: "contain" }}
        />
      </div>

      {/* Center - About Text */}
      <div style={{ flex: "2", textAlign: "center", marginTop: "10px" }}>
        <p style={{ margin: 0, fontSize: "16px", maxWidth: "500px" }}>
          Zeyphr is a marketplace where anyone can sell anything and buy with
          anything.
        </p>
      </div>

      {/* Right Side - IOTA Logo */}
      <div style={{ flex: "1", display: "flex", justifyContent: "center" }}>
        <img
          src="/iota_white.png" // replace with your IOTA logo path
          alt="IOTA Logo"
          style={{ height: "50px", objectFit: "contain" }}
        />
      </div>
    </footer>
  );
};

export default Footer;
