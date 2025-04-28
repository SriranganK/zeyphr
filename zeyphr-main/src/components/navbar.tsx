import { useState } from "react";
import { ArrowRight, ShoppingCart, Search, X } from "lucide-react";
import "../../globals.css";
import "../styles/navbar.css";
import { useRouter } from "next/router";

const Navbar = () => {
  const [showSearchBar, setShowSearchBar] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const router = useRouter();

  const logout = () => {
    localStorage.removeItem("token");
    router.replace("/login");
  };

  return (
    <nav className="navbar">
      {/* Logo */}
      <div className="navbar-left">
        <img
          src="zeyphr.png"
          alt="Logo"
          className="logo"
          onClick={() => router.push("/home")}
          style={{ cursor: "pointer" }}
        />
      </div>

      {/* Middle - Search */}
      <div className="navbar-middle">
        {!showSearchBar && (
          <input
            type="text"
            placeholder="Search"
            className="desktop-search desktop-only"
          />
        )}
      </div>

      {/* Right */}
      <div className="navbar-right">
        {/* Show search icon always */}
        {!showSearchBar && (
          <button
            className="icon-button"
            onClick={() => setShowSearchBar(true)}
          >
            <Search size={20} />
          </button>
        )}

        {/* Hide these when search is open */}
        {!showSearchBar && (
          <>
            <button
              className="icon-button"
              onClick={() => window.open("/cart")}
            >
              <ShoppingCart size={20} />
            </button>

            <button
              className="sell-btn desktop-only"
              onClick={() => window.open("/sell")}
              onMouseOver={(e) =>
                (e.currentTarget.style.backgroundColor = "#1871e1")
              }
              onMouseOut={(e) =>
                (e.currentTarget.style.backgroundColor = "#6238f1")
              }
            >
              Sell <ArrowRight size={16} style={{ marginLeft: "5px" }} />
            </button>

            <button
              className="icon-button"
              onClick={() => setShowDropdown(!showDropdown)}
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#6B7280"
                strokeWidth="2"
              >
                <circle cx="12" cy="7.5" r="4" />
                <path d="M3.792 20.708C4.81 17.598 7.867 15.5 12 15.5c4.133 0 7.19 2.098 8.208 5.208" />
              </svg>
            </button>

            {showDropdown && (
              <div className="dropdown">
                <button
                  className="dropdown-item mobile-only"
                  onClick={() => window.open("/sell")}
                >
                  Sell
                </button>
                <button className="dropdown-item" onClick={logout}>
                  Sign Out
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Search Full Width Modal */}
      {showSearchBar && (
        <div className="search-full-modal">
          <input
            type="text"
            placeholder="Search..."
            className="search-modal-input-full"
            style={{ width: "200px" , height:"30px", borderRadius:"30px"}}
          />
          <button
            className="close-modal-btn"
            onClick={() => setShowSearchBar(false)}
          >
            <X size={24} />
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
