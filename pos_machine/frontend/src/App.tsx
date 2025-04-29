import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AmountPage from "./pages/AmountPage";
import FailurePage from "./pages/FailurePage";
import HomePage from "./pages/HomePage";
import QrPage from "./pages/QrCodePage";
import SuccessPage from "./pages/SuccessPage";
import TapPage from "./pages/TapPage";
import InsufficientBalancePage from "./pages/InsufficientBalance";
import ProcessingPage from "./pages/ProcessingPage";  
import LoginPage from "./pages/LoginPage";



function App() {
  return (
    <Router>
      <Routes>
        <Route path="/homepage" element={<HomePage />} />
        <Route path="/amount" element={<AmountPage />} />
        <Route path="/scan" element={<QrPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/tap" element={<TapPage />} />
        <Route path="/failure" element={<FailurePage />} />
        <Route path="/insufficientbalance" element={<InsufficientBalancePage />} />
        <Route path="/processing" element={<ProcessingPage />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>
    </Router>
  );
}

export default App;
