import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const AuthForm = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "" });
  const [secretCode, setSecretCode] = useState("");
  const [askSecretCode, setAskSecretCode] = useState(false); // NEW: whether to ask secret code
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
    setMessage("");
  };

  const handleSecretCodeChange = (e) => {
    setSecretCode(e.target.value);
    setError("");
    setMessage("");
  };

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:5000/login",
        { email: form.email.trim().toLowerCase(), password: form.password },
        { withCredentials: true }
      );
      localStorage.setItem("isAuthenticated", "true");
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.error || "Login failed");
    }
  };

  // New step 1: On Register button click, validate password, then ask for secret code
  const startRegister = () => {
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setAskSecretCode(true);
  };

  // New step 2: After user enters secret code and submits, do actual register API call
  const submitRegister = async () => {
    if (!secretCode) {
      setError("Please enter the secret code");
      return;
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/register",
        { 
          email: form.email.trim().toLowerCase(), 
          password: form.password, 
          secret_code: secretCode 
        },
        { withCredentials: true }
      );
      setMessage("Registration successful! You can now log in.");
      setIsRegistering(false);
      setAskSecretCode(false);
      setSecretCode("");
      setForm({ email: "", password: "", confirmPassword: "" });
    } catch (err) {
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a23] to-[#1c1c3c] p-6">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl flex w-full max-w-md flex-col items-center p-8 space-y-6">
        <img src="/logo.jpg" alt="Obi‑Watch‑Kenobi Logo" className="w-35 h-35 mb-4" />

        <h2 className="text-3xl font-bold text-white">
          {isRegistering ? 'Register' : 'Login'}
        </h2>

        {message && (
          <div className="text-green-400 bg-green-900/30 px-4 py-2 rounded">
            {message}
          </div>
        )}
        {error && (
          <div className="text-red-400 bg-red-900/30 px-4 py-2 rounded">
            {error}
          </div>
        )}

        <div className="w-full space-y-4">
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-full bg-purple-600 text-white placeholder-gray-300 focus:outline-none"
          />

          <input
            name="password"
            type="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-full bg-purple-600 text-white placeholder-gray-300 focus:outline-none"
          />

          {isRegistering && !askSecretCode && (
            <input
              name="confirmPassword"
              type="password"
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-full bg-purple-600 text-white placeholder-gray-300 focus:outline-none"
            />
          )}

          {/* Show secret code input only after user presses Register and passwords match */}
          {isRegistering && askSecretCode && (
            <input
              name="secretCode"
              type="text"
              placeholder="Enter Secret Code"
              value={secretCode}
              onChange={handleSecretCodeChange}
              className="w-full px-4 py-2 rounded-full bg-purple-600 text-white placeholder-gray-300 focus:outline-none"
            />
          )}

          {/* Register button behavior changes based on whether secret code is being asked */}
          <button
            onClick={isRegistering ? (askSecretCode ? submitRegister : startRegister) : handleLogin}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-full transition"
          >
            {isRegistering ? (askSecretCode ? 'Submit Secret Code' : 'Register') : 'Login'}
          </button>
        </div>

        <div className="text-white">
          {isRegistering ? (
            <p>
              Already have an account?{' '}
              <button
                onClick={() => {
                  setIsRegistering(false);
                  setAskSecretCode(false);
                  setSecretCode("");
                  setError("");
                  setMessage("");
                }}
                className="underline"
              >
                Login
              </button>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <button
                onClick={() => {
                  setIsRegistering(true);
                  setAskSecretCode(false);
                  setSecretCode("");
                  setError("");
                  setMessage("");
                }}
                className="underline"
              >
                Register
              </button>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
