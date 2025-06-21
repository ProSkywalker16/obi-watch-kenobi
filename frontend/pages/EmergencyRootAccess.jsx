import { useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function EmergencyRootAccess() {
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [userExists, setUserExists] = useState(false);
    const [isEmailVerified, setIsEmailVerified] = useState(false);
    const [accessGranted, setAccessGranted] = useState(false);
    const [form, setForm] = useState({
        email: "",
        verificationCode: "",
    });
    const [accessCredentials, setAccessCredentials] = useState("");

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setError("");
        setMessage("");
    };

    const checkUserExists = () => {
    console.log("Checking user existence for email:", form.email);
    try {
      setLoading(true);
      axios.post(
        "http://localhost:5000/root_access/check_user",
        { email: form.email.trim().toLowerCase() },
        { withCredentials: true }
      ).then((res) => {
        setLoading(false);
        setUserExists(true);
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
        "http://localhost:5000/root_access/verify_code",
        { email: form.email.trim().toLowerCase(), code: form.verificationCode },
        { withCredentials: true }
      ).then((res) => {
        setLoading(false);
        setAccessCredentials(res.data.access_credentials || "");
        if (!res.data.access_credentials) {
            setError("Verification failed or no access credentials generated. Please try again.");
            return;
        }
        setAccessGranted(true);
        setMessage(`Verification successful! Your access credentials will be displayed below.`);
        console.log("Access credentials:", res.data.access_credentials);
        setError("");
        setIsEmailVerified(true);
    }).catch((err) => { setLoading(false); setError(err.response?.data?.message || "Verification failed"); });
    } catch (err) {
      setLoading(false);
      setError(err.response?.data?.error || "Verification failed");
    }
  };

    return (
        <div className="h-screen flex items-center justify-center bg-gradient-to-br from-[#0a0a23] to-[#1c1c3c] p-6">
            <div className="bg-white/10 backdrop-blur-md rounded-2xl flex w-full max-w-md flex-col items-center p-8 space-y-6">
                <img src="/logo.jpg" alt="Obi‑Watch‑Kenobi Logo" className="w-35 h-35 mb-4" />
                <h2 className="text-3xl font-bold text-white">
                    Temporary Root Access
                </h2>
                <p className="text-white text-center">
                    This feature is intended for <strong>emergency</strong> situations only. Use with caution.
                </p>
                {!accessGranted && (<p className="text-white text-center">
                    Verify your identity for security purposes. This action will grant you temporary root access to the system.
                </p>)}
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
                    <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
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

                    { userExists  && (
                        <input
                        name="verificationCode"
                        type="text"
                        placeholder="Verification Code"
                        value={form.verificationCode}
                        onChange={handleChange}
                        className="w-full px-4 py-2 rounded-full bg-purple-600 text-white placeholder-gray-300 focus:outline-none"
                    />
                    )}

                    <button
                        onClick={userExists ? (isEmailVerified ? null : verifyCode) : checkUserExists}
                        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-full transition"
                    >
                        {userExists ? (isEmailVerified ? "Access Granted" : "Verify Code") : "Verify User"}
                    </button>
                </div>
                {accessGranted && (<div id="popupModal" class="fixed inset-0 flex items-center justify-center backdrop-blur bg-opacity-90 z-50">
                <div class="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full text-center">
                    <h2 class="text-xl font-semibold mb-4">Root Access Credentials</h2>
                    <p>Your temporary root access has been granted. Please use it responsibly.</p>
                    <p>Remember them. These are not saved in the database.</p>
                    <br />
                    <ul>
                        {Object.entries(accessCredentials).map(([key, value]) => (
                        <li key={key}>{key}: {value}</li>
                        ))}
                    </ul>
                    <br />
                    <Link to="/dashboard" class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600">
                        To Dashboard
                    </Link>
                </div>
                </div>)}
            </div>
        </div>
    );
};

export default EmergencyRootAccess;