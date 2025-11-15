import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import SenderDashboard from './pages/SenderDashboard';
import TravelerDashboard from './pages/TravelerDashboard';
import CreateDelivery from './pages/CreateDelivery';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRole }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (allowedRole && user.role !== allowedRole) {
    return <Navigate to={`/${user.role}/dashboard`} />;
  }

  return children;
};

// Home Component
const Home = () => {
  const { user } = useAuth();

  if (user) {
    return <Navigate to={`/${user.role}/dashboard`} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center px-4">
      <div className="max-w-4xl mx-auto text-center text-white">
        <h1 className="text-5xl md:text-6xl font-bold mb-6">
          Welcome to Trip-N-Drop
        </h1>
        <p className="text-xl md:text-2xl mb-8">
          Connect senders with travelers for affordable, convenient deliveries
        </p>
        <div className="flex flex-col md:flex-row gap-4 justify-center">
          <a
            href="/signup"
            className="bg-white text-indigo-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
          >
            Get Started
          </a>
          <a
            href="/login"
            className="bg-transparent border-2 border-white text-white px-8 py-3 rounded-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors"
          >
            Login
          </a>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">For Senders</h3>
            <p>Send your packages affordably with travelers going your way</p>
          </div>
          <div className="bg-white bg-opacity-10 backdrop-blur-lg rounded-lg p-6">
            <h3 className="text-2xl font-bold mb-3">For Travelers</h3>
            <p>Earn extra income by delivering packages along your route</p>
          </div>
        </div>
      </div>
    </div>
  );
};

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className="App">
          <Navbar />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            
            {/* Sender Routes */}
            <Route
              path="/sender/dashboard"
              element={
                <ProtectedRoute allowedRole="sender">
                  <SenderDashboard />
                </ProtectedRoute>
              }
            />
            <Route
              path="/sender/create-delivery"
              element={
                <ProtectedRoute allowedRole="sender">
                  <CreateDelivery />
                </ProtectedRoute>
              }
            />
            
            {/* Traveler Routes */}
            <Route
              path="/traveler/dashboard"
              element={
                <ProtectedRoute allowedRole="traveler">
                  <TravelerDashboard />
                </ProtectedRoute>
              }
            />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;