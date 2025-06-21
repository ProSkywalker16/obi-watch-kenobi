import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {Eye, EyeOff} from 'lucide-react';

const AuthForm = () => {
  const navigate = useNavigate();
  const [isRegistering, setIsRegistering] = useState(false);
  const [forgotPassword, setForgotPassword] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [isEmailVerified, setIsEmailVerified] = useState(false);
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "", verificationCode: "", newPassword: "" });
  const [secretCode, setSecretCode] = useState("");
  const [askSecretCode, setAskSecretCode] = useState(false); // NEW: whether to ask secret code
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/login",
        { email: form.email.trim().toLowerCase(), password: form.password },
        { withCredentials: true }
      );
      localStorage.setItem("isAuthenticated", "true");
      setLoading(false);
      setMessage("Login successful!");
      setError("");
      navigate("/");
    } catch (err) {
      setLoading(false);
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
      setLoading(true);
      const res = await axios.post(
        "http://localhost:5000/register",
        { 
          email: form.email.trim().toLowerCase(), 
          password: form.password, 
          secret_code: secretCode 
        },
        { withCredentials: true }
      );
      setLoading(false);
      setMessage("Registration successful! You can now log in.");
      setError("");
      setIsRegistering(false);
      setAskSecretCode(false);
      setSecretCode("");
      setForm({ email: "", password: "", confirmPassword: "" });
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || "Registration failed");
    }
  };

  const checkUserExists = () => {
    try {
      setLoading(true);
      axios.post(
        "http://localhost:5000/forgot_password",
        { email: form.email.trim().toLowerCase() },
        { withCredentials: true }
      ).then((res) => {
        setLoading(false);
        setUserExists(true);
        setForgotPassword(true);
        setMessage(res.data.message || "User exists. Please enter your verification code.");
        setError("");
        setIsEmailVerified(false);
      }).catch((err) => {
        setLoading(false);
        setUserExists(false);
        setError(err.response?.data?.message || "Error checking user existence");
      });
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || "Error checking user existence");
    }
  };

  const verifyCode = () => {
    if (!form.verificationCode) {
      setError("Please enter the verification code");
      return;
    }

    try {
      setLoading(true);
      axios.post(
        "http://localhost:5000/verify_code",
        { email: form.email.trim().toLowerCase(), code: form.verificationCode },
        { withCredentials: true }
      ).then((res) => {
        setLoading(false);
        setMessage(res.data.message || "Verification successful! You can reset your password now.");
        setError("");
        setIsEmailVerified(true);
    }).catch((err) => { setLoading(false); setError(err.response?.data?.message || "Verification failed"); });
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || "Verification failed");
    }
  };

  const resetPassword = () => {
    if (!form.newPassword) {
      setError("Please enter your new password");
      return;
    }

    try {
      setLoading(true);
      axios.post(
        "http://localhost:5000/reset_password",
        { email: form.email.trim().toLowerCase(), new_password: form.newPassword },
        { withCredentials: true }
      ).then((res) => {
        setLoading(false);
        setError("");
        setForm({ email: "", password: "", confirmPassword: "", verificationCode: "", newPassword: "" });
        setForgotPassword(false);
        setUserExists(false);
        setIsEmailVerified(false);
        setMessage(res.data.message || "Password reset successful! You can now log in.");
      }).catch((err) => { setLoading(false); setError(err.response?.data?.message || "Error resetting password"); });
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a23] to-[#1c1c3c] p-6">
      <div className="bg-white/10 backdrop-blur-md rounded-2xl flex w-full max-w-md flex-col items-center p-8 space-y-6">
        <img src="/logo.jpg" alt="Obi‑Watch‑Kenobi Logo" className="w-35 h-35 mb-4" />

        <h2 className="text-3xl font-bold text-white">
          {forgotPassword ? 'Forgot Password' : isRegistering ? 'Register' : 'Login'}
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
        {/* Full Page Loading Overlay */}
        {loading && (
          <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="text-white text-xl animate-pulse">Loading...  </div>
            <div class="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
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
          {!forgotPassword && (
          <div className="relative w-full max-w-md">
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-4 py-2 rounded-full bg-purple-600 text-white placeholder-gray-300 focus:outline-none"
          />
          <button
            type="button"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600"
            onClick={() => setShowPassword((prev) => !prev)}
          >
            {showPassword ? <EyeOff size={20} color="white" /> : <Eye size={20} color="white" />}
          </button>
          </div>
          )}
          {isRegistering && !askSecretCode && (
            <div className="relative w-full max-w-md">
            <input
              name="confirmPassword"
              type={showPassword ? "text" : "password"}
              placeholder="Confirm Password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-full bg-purple-600 text-white placeholder-gray-300 focus:outline-none"
            />
            <button
              type="button"
              className="absolute top-1/2 right-3 -translate-y-1/2 text-gray-600"
              onClick={() => setShowPassword((prev) => !prev)}
            >
              {showPassword ? <EyeOff size={20} color="white" /> : <Eye size={20} color="white" />}
            </button>
            </div>
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
          {/*Show verification code input only if userExists is true*/}
          {forgotPassword && userExists && !isEmailVerified && (
            <input
              name="verificationCode"
              type="text"
              placeholder="Enter Verification Code"
              value={form.verificationCode}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-full bg-purple-600 text-white placeholder-gray-300 focus:outline-none"
            />
          )}
          {forgotPassword && userExists && isEmailVerified && (
            <input
              name="newPassword"
              type="password"
              placeholder="Enter New Password"
              value={form.newPassword}
              onChange={handleChange}
              className="w-full px-4 py-2 rounded-full bg-purple-600 text-white placeholder-gray-300 focus:outline-none"
            />
          )}
          {/* Register button behavior changes based on whether secret code is being asked */}
          {!forgotPassword ? (
          <button
            onClick={isRegistering ? (askSecretCode ? submitRegister : startRegister) : handleLogin}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-full transition"
          >
            {isRegistering ? (askSecretCode ? 'Submit Secret Code' : 'Register') : 'Login'}
          </button>) : (!userExists ? (
          <button
            onClick={checkUserExists}
            className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-full transition"
          > 
            Verify User
          </button>
          ): (isEmailVerified ? (
            <button
              onClick={resetPassword}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-full transition"
            >
              Reset password
            </button>
          ): <button
              onClick={verifyCode}
              className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-full transition"
            >
              Verify Code
            </button>))
          }
        </div>
        {!isRegistering && !forgotPassword && (<div className="text-white">
          <p>
            <button
              onClick={() => {
                setError("");
                setForgotPassword(true);
                setUserExists(false);
                setIsEmailVerified(false);
                setMessage("Enter your email to receive a verification code.");
              }}
              className="underline"
            >
              Forgot Password?
            </button>
          </p>
        </div>)}
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
          ) : (!forgotPassword && (
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
          ))}
        </div>
      </div>
    </div>
  );
};

export default AuthForm;
