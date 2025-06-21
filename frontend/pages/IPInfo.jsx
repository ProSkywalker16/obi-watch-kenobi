import React, { useEffect, useState, useRef } from "react";
import { useParams } from "react-router-dom";
import L from 'leaflet';
import { AlertTriangle } from "lucide-react";
import { CheckCircle } from "lucide-react"

// Utility to check for private IP ranges
const isPrivateIP = (ip) => {
  // IPv4 private ranges: 10.0.0.0/8, 172.16.0.0/12, 192.168.0.0/16
  const parts = ip.split('.').map(Number);
  if (parts.length !== 4 || parts.some(isNaN)) return false;
  const [a, b] = parts;
  if (a === 10) return true;
  if (a === 172 && b >= 16 && b <= 31) return true;
  if (a === 192 && b === 168) return true;
  return false;
};

const IPInfo = () => {
  const { ip } = useParams();
  const [mapData, setMappedData] = useState(new Map());
  const [latlng, setCoords] = useState([51.505, -0.09]);
  const mapRef = useRef(null);

  // If IP is private, show special message
  if (isPrivateIP(ip)) {
  return (
    <main className="h-screen sm:ml-28 text-white p-10 rounded shadow-md flex flex-col items-center justify-center text-center">
      <AlertTriangle className="text-red-500 w-12 h-12 mb-4" />
      <h2 className="text-2xl text-red-500 font-bold mb-2">PRIVATE IP</h2>
      <h2 className="text-2xl  font-bold mb-2">Check with your team</h2>
      <p className="text-lg">The IP {ip} is a private address and cannot be geolocated.</p>
    </main>
  );
}

  useEffect(() => {
    if (mapRef.current == null) {
      mapRef.current = L.map("map").setView(latlng, 13);
    }
    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: "&copy; OpenStreetMap contributors",
    }).addTo(mapRef.current);
    L.marker(latlng).addTo(mapRef.current);
    return () => {
      mapRef.current?.remove();
      mapRef.current = null;
    };
  }, [latlng]);

  useEffect(() => {
    const fetchIPInfo = async () => {
      try {
        const response = await fetch(`http://127.0.0.1:5000/log_storage/ipinfo?ip_address=${ip}`);
        // const response = await fetch(`http://192.168.31.160:5000/log_storage/ipinfo?ip_address=${ip}`);
        const data = await response.json();
        const md = new Map(Object.entries(JSON.parse(data)));
        setMappedData(md);
        const ll = [parseFloat(md.get("latitude")), parseFloat(md.get("longitude"))];
        setCoords(ll);
      } catch (error) {
        console.error(error);
      }
    };
    fetchIPInfo();
  }, [ip]);

  return (

<main className="sm:ml-28 h-screen text-white p-10 rounded shadow-md">
  
  <div className="flex items-center gap-2 mb-6 text-green-500">
    <CheckCircle className="w-5 h-5" />
    <span className="text-2xl font-medium">IP successfully traced</span>
  </div>

  <h2 className="text-2lg font-bold mb-2">IP Information</h2>


  <div className="flex flex-col md:flex-row p-10 gap-6">
    <table className="min-w-[300px] md:w-1/2 bg-[#bfbfbf21] text-white rounded shadow border border-gray-700">
      <tbody>
        <tr>
          <th className="text-left px-4 py-2 font-semibold border-b border-gray-700">IP Address</th>
          <td className="px-4 py-2 border-b border-gray-700">{ip}</td>
        </tr>
        <tr>
          <th className="text-left px-4 py-2 font-semibold border-b border-gray-700">Bogon</th>
          <td className="px-4 py-2 border-b border-gray-700">{mapData.get("bogon") ? "true" : "false"}</td>
        </tr>
        <tr>
          <th className="text-left px-4 py-2 font-semibold border-b border-gray-700">City</th>
          <td className="px-4 py-2 border-b border-gray-700">{mapData.get("city")}</td>
        </tr>
        <tr>
          <th className="text-left px-4 py-2 font-semibold border-b border-gray-700">Region</th>
          <td className="px-4 py-2 border-b border-gray-700">{mapData.get("region")}</td>
        </tr>
        <tr>
          <th className="text-left px-4 py-2 font-semibold border-b border-gray-700">Country</th>
          <td className="px-4 py-2 border-b border-gray-700">{mapData.get("country")}</td>
        </tr>
        <tr>
          <th className="text-left px-4 py-2 font-semibold border-b border-gray-700">Latitude</th>
          <td className="px-4 py-2 border-b border-gray-700">{mapData.get("latitude")}</td>
        </tr>
        <tr>
          <th className="text-left px-4 py-2 font-semibold">Longitude</th>
          <td className="px-4 py-2">{mapData.get("longitude")}</td>
        </tr>
      </tbody>
    </table>

    <div
      id="map"
      className="md:w-3/4 rounded shadow border border-gray-700"
      style={{ height: "300px" }}
    ></div>
  </div>
</main>

  );
};

export default IPInfo;
