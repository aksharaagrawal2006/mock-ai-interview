import { Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import Navbar from "./components/Navbar.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

import Landing from "./pages/Landing.jsx";
import Login from "./pages/Login.jsx";
import Dashboard from "./pages/Dashboard.jsx";
import NewInterview from "./pages/NewInterview.jsx";
import InterviewSession from "./pages/InterviewSession.jsx";
import History from "./pages/History.jsx";
import Admin from "./pages/Admin.jsx";

function App() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <Toaster
        position="top-right"
        toastOptions={{
          className: "font-body text-sm",
          style: { borderRadius: "12px" },
        }}
      />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/interview/new" element={<ProtectedRoute><NewInterview /></ProtectedRoute>} />
          <Route path="/interview/:id" element={<ProtectedRoute><InterviewSession /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/admin" element={<ProtectedRoute adminOnly><Admin /></ProtectedRoute>} />
        </Routes>
      </main>
    </div>
  );
}

export default App;
