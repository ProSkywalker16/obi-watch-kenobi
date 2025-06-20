// components/ui/globe.jsx
import React, { useEffect, useRef, useState } from 'react';
import Globe from 'react-globe.gl';

export default function GlobeDemo() {
  const globeRef = useRef();
  const [arcs, setArcs] = useState([]);

  const globeConfig = {
    pointSize: 4,
    globeColor: '#062056',
    showAtmosphere: true,
    atmosphereColor: '#FFFFFF',
    atmosphereAltitude: 0.1,
    emissive: '#062056',
    emissiveIntensity: 0.1,
    shininess: 0.9,
    polygonColor: 'rgba(255,255,255,0.7)',
    ambientLight: '#38bdf8',
    directionalLeftLight: '#ffffff',
    directionalTopLight: '#ffffff',
    pointLight: '#ffffff',
    arcTime: 1000,
    arcLength: 0.9,
    rings: 1,
    maxRings: 3,
    initialPosition: { lat: 22.3193, lng: 114.1694 },
    autoRotate: true,
    autoRotateSpeed: 4.0, // Increased autoRotateSpeed for faster rotation
  };

  useEffect(() => {
    const colors = ['#06b6d4', '#3b82f6', '#6366f1'];
    const getColor = () => colors[Math.floor(Math.random() * colors.length)];

    setArcs([
      {
        startLat: 37.7749,
        startLng: -122.4194,
        endLat: 40.7128,
        endLng: -74.006,
        arcAlt: 0.3,
        color: getColor(),
      },
      {
        startLat: 51.5072,
        startLng: -0.1276,
        endLat: 48.8566,
        endLng: 2.3522,
        arcAlt: 0.2,
        color: getColor(),
      },
      {
        startLat: 28.6139,
        startLng: 77.209,
        endLat: 35.6895,
        endLng: 139.6917,
        arcAlt: 0.25,
        color: getColor(),
      },
      {
        startLat: 28.6139,
        startLng: 77.2090,
        endLat: -12.0464,
        endLng: -77.0428,
        arcAlt: 0.35,
        color: getColor(),
      },
      {
        startLat: -27.4698,
        startLng: 153.0251,
        endLat: -34.6037,
        endLng: 150.8855,
        arcAlt: 0.45,
        color: getColor(),
      },
      {
        startLat: 48.8566,
        startLng: 2.3522,
        endLat: 30.0444,
        endLng: 31.2357,
        arcAlt: 0.55,
        color: getColor(),
      },
      {
        startLat: -22.9068,
        startLng: -43.1729,
        endLat: 19.4326,
        endLng: -99.1332,
        arcAlt: 0.25,
        color: getColor(),
      },
      {
        startLat: 31.2304,
        startLng: 121.4737,
        endLat: 43.6532,
        endLng: -79.3832,
        arcAlt: 0.65,
        color: getColor(),
      }
    ]);
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = true;
      globeRef.current.controls().autoRotateSpeed = globeConfig.autoRotateSpeed || 1.0;
    }
  }, [globeConfig.autoRotateSpeed]); // Added globeConfig.autoRotateSpeed as dependency

  return (
    <div className="w-full h-[40rem]">
      <Globe
        ref={globeRef}
        globeImageUrl="//unpkg.com/three-globe/example/img/earth-night.jpg"
        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
        backgroundColor="rgba(0,0,0,0)"
        arcsData={arcs}
        arcColor={(d) => d.color}
        arcDashLength={0.4}
        arcDashGap={4}
        arcDashInitialGap={() => Math.random() * 5}
        arcDashAnimateTime={globeConfig.arcTime}
        arcStroke={1.5}
        arcAltitude={(d) => d.arcAlt}
        atmosphereColor={globeConfig.atmosphereColor}
        atmosphereAltitude={globeConfig.atmosphereAltitude}
        showAtmosphere={globeConfig.showAtmosphere}
        autoRotate={globeConfig.autoRotate}
        autoRotateSpeed={globeConfig.autoRotateSpeed} // Set the speed directly as a prop
      />
    </div>
  );
}