import "./styles/style.css";
import "./styles/success_failure.css";
import { useNavigate, useLocation } from "react-router-dom";

const FailurePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const message = location.state?.message || "Something went wrong";

  const handleClose = () => {
    navigate("/homepage"); // Navigate to the scan page
  };

  return (
    <div className="home-fullscreen failure-page">
      <button className="close-icon" onClick={handleClose}>✕</button>
      <img src="/zeyphr.png" alt="Zeyphr Logo" className="logo" />

      <div className="center-content">
        <div className="failure-icon">
          <div className="circle">
            <div className="cross"></div>
          </div>
        </div>
        <h2 className="failure-message">{message}</h2>
      </div>

      <div className="footer">
        <img src="/iota-logo.png" alt="IOTA" className="iota-logo" />
      </div>
    </div>
  );
};

export default FailurePage;
