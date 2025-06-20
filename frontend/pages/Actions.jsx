// src/pages/Actions.jsx
import React, { useEffect, useState } from "react";

const Actions = () => {
  const [actions, setActions] = useState([]);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState("");

  useEffect(() => {
    fetchActions();
    const interval = setInterval(fetchActions, 10000); // Auto-refresh every 10 sec
    return () => clearInterval(interval);
  }, []);

  const fetchActions = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/actions");
      if (!res.ok) throw new Error("Failed to fetch actions");
      const data = await res.json();
      setActions(data);
      setLastUpdate(new Date().toLocaleTimeString());
      setError(null);
    } catch (err) {
      console.error(err);
      setError("Could not load actions.");
    }
  };

  return (
    <div className="p-6 sm:ml-28 text-white">
      <header className="flex flex-col md:flex-row justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold">Actions</h1>
          <p className="text-sm text-gray-400">
            Last updated: {lastUpdate || "Loading..."}
          </p>
        </div>
      </header>

      {error ? (
        <p className="text-red-400">{error}</p>
      ) : (
        <div className="overflow-x-auto bg-gradient-to-r from-[#15102d] to-[#1b1137] p-4 rounded shadow-2xl shadow-black">
          <table className="min-w-full text-sm text-left border border-white/20 text-white">
            <thead className="bg-[#19163F] text-white/80 text-xs uppercase">
              <tr>
                <th className="px-4 py-3 border border-white/20">ID</th>
                <th className="px-4 py-3 border border-white/20">IP</th>
                <th className="px-4 py-3 border border-white/20">Activity</th>
                <th className="px-4 py-3 border border-white/20">Severity</th>
                <th className="px-4 py-3 border border-white/20">Timestamp</th>
              </tr>
            </thead>
            <tbody className="bg-[#0D0B36]">
              {actions.length > 0 ? (
                actions.map((action) => (
                  <tr
                    key={action.id}
                    className="hover:bg-indigo-950 transition"
                    style={{ borderLeft: `5px solid #4ADE80` }} // green bar
                  >
                    <td className="px-4 py-3 border border-white/20">{action.id}</td>
                    <td className="px-4 py-3 border border-white/20">{action.ip}</td>
                    <td className="px-4 py-3 border border-white/20">{action.activity}</td>
                    <td className="px-4 py-3 border border-white/20">{action.severity}</td>
                    <td className="px-4 py-3 border border-white/20">{action.timestamp}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td className="px-4 py-3 border border-white/20" colSpan="5">
                    No actions found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      <footer className="text-center text-sm text-slate-400 mt-10">
          &copy; 2025 Obi-Watch-Kenobi by Proskywalker, Honurag Hottacharjee, Felle Kelabo and Holy Father aka RIYAL POPE..
        </footer>
    </div>
  );
};

export default Actions;
