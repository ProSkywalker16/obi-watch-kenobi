import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend,
} from "chart.js";
import { Radar } from "react-chartjs-2";

// Register radar chart components
ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

const Actions = () => {
  const [actions, setActions] = useState([]);
  const [error, setError] = useState(null);
  const [lastUpdate, setLastUpdate] = useState("");

  useEffect(() => {
    fetchActions();
    const interval = setInterval(fetchActions, 10000);
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

  // Map severity to color
  const getSeverityColor = (severity) => {
    switch ((severity || "").toLowerCase()) {
      case "critical":
        return "#EF4444"; // Red
      case "high":
        return "#F97316"; // Orange
      case "medium":
        return "#EAB308"; // Yellow
      case "low":
        return "#4ADE80"; // Green
      default:
        return "#64748B"; // Gray
    }
  };

  // Count severity frequencies
  const severityMap = actions.reduce((acc, curr) => {
    acc[curr.severity] = (acc[curr.severity] || 0) + 1;
    return acc;
  }, {});

  const radarData = {
    labels: Object.keys(severityMap),
    datasets: [
      {
        label: "Severity Count",
        data: Object.values(severityMap),
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        borderColor: "#4ade80",
        borderWidth: 2,
        pointBackgroundColor: "#4ade80",
      },
    ],
  };

  const radarOptions = {
    responsive: true,
    scales: {
      r: {
        angleLines: { display: true },
        suggestedMin: 0,
        suggestedMax: Math.max(...Object.values(severityMap), 3),
        ticks: {
          display: false,
          color: "#ffffff",
        },
        pointLabels: {
          font: {
    size: 16, // ✅ Increase this value as needed
    weight: 'bold', // (optional) for emphasis
  },
          color: "#ffffff",
        },
        grid: {
          color: "rgba(255, 255, 255, 0.2)",
        },
      },
    },
    plugins: {
      legend: {
        labels: {
          color: "#ffffff",
        },
      },
    },
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
        <>

          <div className="flex flex-col md:flex-row gap-6">
            {/* Radar Chart */}
            <div className="w-full md:w-3/8 bg-[#19163F] p-4 rounded shadow-md flex items-center justify-center h-[28rem]">
  <div className="text-center">
    <h2 className="text-2xl font-semibold mb-4">Severity Radar Chart</h2>
    <div className="w-[24rem] h-[24rem] mx-auto">
      <Radar data={radarData} options={radarOptions} />
    </div>
  </div>
</div>
            {/* Table */}
            <div className="w-full md:w-5/8 overflow-x-auto bg-gradient-to-r from-[#15102d] to-[#1b1137] p-4 rounded shadow-2xl shadow-black">
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
                    [...actions].slice(-9).reverse().map((action) => {
                      return (
                        <tr
                          key={action.id}
                          className="hover:bg-indigo-950 transition"
                          style={{
                            borderLeft: `5px solid ${getSeverityColor(action.severity)}`,
                          }}
                        >
                          <td className="px-4 py-3 border border-white/20">{action.id}</td>
                          <td className="px-4 py-3 border border-white/20">{action.ip}</td>
                          <td className="px-4 py-3 border border-white/20">{action.activity}</td>
                          <td className="px-4 py-3 border border-white/20">{action.severity}</td>
                          <td className="px-4 py-3 border border-white/20">{action.timestamp}</td>
                        </tr>
                      );
                    })
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


          </div>

        </>
      )}

      <footer className="text-center text-sm text-slate-400 mt-10">
        &copy; 2025 Obi-Watch-Kenobi by Proskywalker, Honurag Hottacharjee, Felle Kelabo and Holy Father aka RIYAL POPE..
      </footer>
    </div>
  );
};

export default Actions;
