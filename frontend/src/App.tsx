import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AmountPage from "./pages/AmountPage";
import FailurePage from "./pages/FailurePage";
import HomePage from "./pages/HomePage";
import QrPage from "./pages/QrCodePage";
import SuccessPage from "./pages/SuccessPage";
import TapPage from "./pages/TapPage";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/amount" element={<AmountPage />} />
        <Route path="/scan" element={<QrPage />} />
        <Route path="/success" element={<SuccessPage />} />
        <Route path="/tap" element={<TapPage />} />
        <Route path="/failure" element={<FailurePage />} />
      </Routes>
    </Router>
  );
}

export default App;
