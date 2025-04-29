import "./styles/style.css";
import "./styles/success_failure.css"
import { useNavigate } from "react-router-dom";
const FailurePage: React.FC = () => {
  const navigate = useNavigate();
  return (
    <div className="home-fullscreen failure-page">
      <img src="/zeyphr.png" alt="Zeyphr Logo" className="logo" />
      <button className="close-icon" onClick={()=> navigate("/homepage")}>
      x
      </button>
      <div className="failure-warning">❌</div>

      <h2 className="failure-message">Payment Failed</h2>

      <div className="footer">
        {/* <p className="powered-by">Powered by</p> */}
        <img src="/iota-logo.png" alt="IOTA" className="iota-logo" />
      </div>
    </div>
  );
};

export default FailurePage;
