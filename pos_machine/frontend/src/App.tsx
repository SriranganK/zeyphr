import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import AmountPage from "./pages/AmountPage";
import FailurePage from "./pages/FailurePage";
import HomePage from "./pages/HomePage";
import QrPage from "./pages/QrCodePage";
import SuccessPage from "./pages/SuccessPage";
import TapPage from "./pages/TapPage";
import ProcessingPage from "./pages/ProcessingPage";  
import LoginPage from "./pages/LoginPage";

import ProtectedRoute from "./pages/ProtectedRoute";

function App() {
  return (
    <Router>
      <Routes>
        {/* Public route */}
        <Route path="/" element={<LoginPage />} />

        {/* Protected routes */}
        <Route path="/homepage" element={
          <ProtectedRoute><HomePage /></ProtectedRoute>
        } />
        <Route path="/amount" element={
          <ProtectedRoute><AmountPage /></ProtectedRoute>
        } />
        <Route path="/scan" element={
          <ProtectedRoute><QrPage /></ProtectedRoute>
        } />
        <Route path="/success" element={
          <ProtectedRoute><SuccessPage /></ProtectedRoute>
        } />
        <Route path="/tap" element={
          <ProtectedRoute><TapPage /></ProtectedRoute>
        } />
        <Route path="/failure" element={
          <ProtectedRoute><FailurePage /></ProtectedRoute>
        } />
        <Route path="/processing" element={
          <ProtectedRoute><ProcessingPage /></ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
}

export default App;
