import React, { useEffect, useState, useRef } from "react";
import Chart from "chart.js/auto";
import { Link, useNavigate } from "react-router-dom";
import { SignedIn, SignedOut, SignInButton, UserButton } from '@clerk/clerk-react';
import Sidebar from '../components/Sidebar';

const severityColors = {
  INFO: "#800080",
  LOW: "#008000",
  MEDIUM: "#fbf295",
  HIGH: "#FFA500",
  CRITICAL: "#FF0000",
  WARNING: "#A52A2A",
  ERROR: "#FF0000",
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const handleClick = () => {
    navigate('/actions');
  };

  const [username, setUsername] = useState(localStorage.getItem("username") || "");
  const [logs, setLogs] = useState([]);
  const [filter, setFilter] = useState("");
  const [search, setSearch] = useState("");
  const [lastUpdate, setLastUpdate] = useState("");
  const chartRef = useRef(null);
  const pieChart = useRef(null);

  

  useEffect(() => {
    fetchLogs();
    const interval = setInterval(fetchLogs, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchLogs = async () => {
    try {
      const res = await fetch("http://127.0.0.1:5000/log_storage");
      const data = await res.json();
      setLogs(data);
      setLastUpdate(new Date().toLocaleTimeString());
      updatePieChart(data);
    } catch (err) {
      console.error("Error fetching logs:", err);
    }
  };

  const updatePieChart = (logData) => {
    const counts = logData.reduce((acc, log) => {
      const level = String(log[3]).toUpperCase().trim();
      acc[level] = (acc[level] || 0) + 1;
      return acc;
    }, {});

    const labels = Object.keys(counts);
    const data = Object.values(counts);
    const colors = labels.map((l) => severityColors[l] || "#cccccc");

    if (pieChart.current) {
      pieChart.current.destroy();
    }

    pieChart.current = new Chart(chartRef.current, {
      type: "doughnut",
      data: {
        labels,
        datasets: [{
          data,
          backgroundColor: colors,
          hoverOffset: 10,
        }],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: {
              color: "#ffffff",
            },
          },
          title: {
            display: true,
            text: "Logs by Severity Level",
            color: "#ffffff",
          },
          tooltip: {
            bodyColor: "#ffffff",
            titleColor: "#ffffff",
          },
        },
      },
    });
  };

  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    localStorage.removeItem("username");
    window.dispatchEvent(new Event('storage'));
    navigate('/');
  };

  const filteredLogs = logs.filter((r) => {
    const sev = String(r[3]).toUpperCase().trim();
    const msg = r[1].toLowerCase();
    return (!filter || sev === filter) && (!search || msg.includes(search));
  });

  const isIPv4 = (ip) => {
    const regex = /^(([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])\.){3}([0-9]|[1-9][0-9]|1[0-9][0-9]|2[0-4][0-9]|25[0-5])$/;
    return regex.test(ip);
  };

  return (
    <div className="w-full text-white">
      <main className="sm:ml-28 text-white p-5 rounded shadow-md">
        <div className="flex flex-col lg:flex-row gap-6">
          <div className="shadow-2xl shadow-black w-full lg:max-w-[400px] flex justify-center items-center bg-gradient-to-r from-[#15102d] to-[#1b1137] text-white rounded p-4">
            <canvas ref={chartRef} className="w-[300px] h-[300px]" />
          </div>

          <div className="flex-1 overflow-x-auto rounded shadow-2xl shadow-black bg-gradient-to-r from-[#15102d] to-[#1b1137] text-white p-4">
            <div className="flex pb-5 items-center justify-between">
              <h2 className="text-lg font-semibold mb-2">
                Log Data (<span className="text-red-600">{filteredLogs.length}</span>)
              </h2>
              
              <div className="flex gap-2 items-center">
                <select
                  value={filter}
                  onChange={(e) => setFilter(e.target.value)}
                  className="bg-[#29224d] text-beige px-2 py-1 rounded"
                >
                  <option value="">ALL</option>
                  <option value="INFO">INFO</option>
                  <option value="LOW">LOW</option>
                  <option value="MEDIUM">MEDIUM</option>
                  <option value="HIGH">HIGH</option>
                  <option value="CRITICAL">CRITICAL</option>
                </select>
                
                <div className="flex gap-2 ml-2">
                  <button
                    onClick={handleClick}
                    className="bg-red-700 text-beige px-2 py-1 rounded"
                  >
                    Actions
                  </button>
                  <button
                    onClick={handleLogout}
                    className="bg-yellow-500 hover:bg-yellow-600 text-beige px-2 py-1 rounded"
                  >
                    Terminate Session
                  </button>
                </div>
              </div>
            </div>

            <table className="min-w-full text-sm text-left text-white border border-white/20 rounded-md border-collapse">
              <thead className="text-xs uppercase bg-[#19163F] text-white/80">
                <tr>
                  <th className="px-4 py-3 font-medium border border-white/20">ID</th>
                  <th className="px-4 py-3 font-medium border border-white/20">Timestamp</th>
                  <th className="px-4 py-3 font-medium border border-white/20">Message</th>
                  <th className="px-4 py-3 font-medium border border-white/20">Level</th>
                  <th className="px-4 py-3 font-medium border border-white/20">IP Address</th>
                </tr>
              </thead>
              <tbody className="bg-[#0D0B36]">
                {filteredLogs.slice(-5).map((r, idx) => {
                  const sev = String(r[3]).toUpperCase().trim();
                  const sevColor = severityColors[sev] || "#FFF";
                  return (
                    <tr
                      key={idx}
                      className="hover:bg-indigo-950 transition"
                      style={{ borderLeft: `5px solid ${sevColor}` }}
                    >
                      <td className="px-4 py-3 border border-white/20">{r[0]}</td>
                      <td className="px-4 py-3 border border-white/20">{r[1]}</td>
                      <td className="px-4 py-3 border border-white/20">{r[2]}</td>
                      <td className="px-4 py-3 font-bold border border-white/20" style={{ color: sevColor }}>
                        {sev}
                      </td>
                      <td className="px-4 py-3 border border-white/20">
                        {isIPv4(r[4]) ? (
                          <Link to={`/log_storage/ipinfo/${r[4]}`}>{r[4]}</Link>
                        ) : (
                          <p>{r[4]}</p>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        <footer className="text-center text-sm text-slate-400 mt-10">
          &copy; 2025 Log Tracker by Proskywalker, Honurag Hottacharjee, Holy Father aka RIYAL POPE..
        </footer>
      </main>
    </div>
  );
};

export default Dashboard;