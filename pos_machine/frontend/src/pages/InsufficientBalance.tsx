import "./styles/style.css";
import "./styles/success_failure.css"
import { useNavigate } from "react-router-dom";

const InsufficientBalancePage: React.FC = () => {
    const navigate = useNavigate();
    const handleClose = () => {
        navigate("/"); // Navigate to the scan page
      };
    return (
        <div className="home-fullscreen failure-page">
             <button className="close-icon" onClick={handleClose}>
        ✕
      </button>
            <img src="/zeyphr.png" alt="Zeyphr Logo" className="logo" />

            {/* <div className="failure-warning">❌</div> */}
            <div className="failure-icon">
                <div className="circle">
                    <div className="cross"></div>
                </div>
            </div>


            <h2 className="failure-message">Insufficient Balance</h2>

            <div className="footer">
                <p className="powered-by">Powered by</p>
                <img src="/iota-logo.png" alt="IOTA" className="iota-logo" />
            </div>
        </div>
    );
};

export default InsufficientBalancePage;
