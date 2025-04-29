import "./styles/style.css"; 
import "./styles/processing.css"; 

const ProcessingPage: React.FC = () => {
  return (
    <div className="home-fullscreen">
    <div className="logo-container">
      <img src="/zeyphr.png" alt="Zeyphr Logo" className="logo" />
    </div>
  
    <div className="processing-content">
      <div className="loader"></div>
      <h2 className="processing-message">Processing...</h2>
    </div>
  
    <div className="footer">
      <p className="powered-by">Powered by</p>
      <img src="/iota-logo.png" alt="IOTA" className="iota-logo" />
    </div>
  </div>
  
  
  );
};

export default ProcessingPage;
