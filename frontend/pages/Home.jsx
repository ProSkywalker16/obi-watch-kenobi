import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextHoverEffect } from '../components/ui/text-hover-effect';
import { TypewriterEffectSmooth } from '../components/ui/typewriter-effect';
import { motion } from 'framer-motion';
import { TerminalSquare } from 'lucide-react';
import GlobeDemo from '../components/ui/globe';
//import { EvervaultCard } from '../components/ui/evervault-card';
import {
  ShieldCheck,
  Laptop2,
  Server,
  DollarSign,
  EyeOff,
  Wrench,
} from "lucide-react";

const images = ["/image1.png", "/image2.png", "/image3.png"];

function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const words = [
    { text: 'AI-Powered' }, { text: 'EDR' }, { text: 'and' },
    { text: 'SIEM' }, {text:'with '}, { text: 'Advanced' }, { text: 'Visualisation' }
  ];

  useEffect(() => {
    const auth = localStorage.getItem('isAuthenticated');
    setIsAuthenticated(auth === 'true');
  }, []);

  const handleLogin = () => navigate('/login');
  const handleLogout = () => {
    localStorage.removeItem('isAuthenticated');
    window.dispatchEvent(new Event('storage'));
    setIsAuthenticated(false);
  };

  const Header = () => (
    <header className="absolute top-4 text-sm text-green-400 text-center w-full z-20">
      <TextHoverEffect text="OBI WATCH KENOBI" />
    </header>
  );

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 2000); // every 2 seconds

    return () => clearInterval(interval);
  }, [images.length]);


  return (
    <div className=" font-mono">
      <Header />
      {isAuthenticated ? (
        <motion.div
          className="flex flex-col items-center bg-black justify-center w-full h-screen"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div
            className="flex flex-col items-center"
            animate={{ y: [10, 0, 10] }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <TerminalSquare className="w-16 h-16 text-green-500 animate-pulse mb-4" />
            <h1 className="text-3xl font-bold mb-4 text-green-500 tracking-widest">
              ACCESS GRANTED
            </h1>
            <div className="flex flex-wrap justify-center gap-4 mb-8">
              <Link
                to="/dashboard"
                className="px-8 py-3 bg-green-700 hover:bg-green-900 rounded-lg text-lg font-medium transition"
              >
                Launch Dashboard
              </Link>
              <button
                onClick={handleLogout}
                className="px-6 py-3 bg-red-600 hover:bg-red-800 rounded-lg text-lg font-medium transition"
              >
                Terminate Session
              </button>
            </div>
            <div className="flex text-white flex-wrap justify-center gap-4 mb-8">
              <Link
                to="/emergency_root_access"
                className="px-8 py-3 bg-red-700 hover:bg-red-800 rounded-lg text-lg font-medium transition"
              >
                Emergency Root Access
              </Link>
            </div>
          </motion.div>


        </motion.div>



      ) : (
        <div className=' bg-gradient-to-r from-slate-950 to-slate-800'>
          <div className=''>
            <GlobeDemo />
            <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4 text-center">
              <img src="/logo.png" alt="Obi‑Watch‑Kenobi Logo" className="w-100 h-100 mb-4 animate-pulse" />
              <div className="text-2xl md:text-4xl tracking-wide mb-6">
                <TypewriterEffectSmooth words={words} />
              </div>
              <button
                onClick={handleLogin}
                className="flex items-center px-8 py-3 bg-cyan-600 hover:bg-cyan-800 rounded-lg text-lg font-medium"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M5 12h14M12 5l7 7-7 7"
                  />
                </svg>
                Continue to System
              </button>
            </div>
          </div>

          <div className="mt-28 py-16 text-white text-center">
            <h2 className="text-4xl font-bold mb-4">Seamless Monitoring. Limitless Control.</h2>
            <p className="max-w-2xl mx-auto text-lg mb-12 text-gray-300">
              Obi‑Watch‑Kenobi is your all-seeing sentinel. Designed for precision, speed, and security, it empowers developers and analysts with real-time system visibility and intelligent diagnostics.
            </p>

            <div className="flex flex-col md:flex-row items-center justify-center gap-10 max-w-6xl mx-auto px-4 py-8">

              {/* Image Carousel */}
              <div className="relative h-96 w-full rounded-lg shadow-lg">
                {images.map((img, index) => (
                  <img
                    key={index}
                    src={img}
                    alt={`Image ${index}`}
                    className={`absolute  w-full h-full  transition-opacity duration-1000 ease-in-out ${index === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                      }`}
                  />
                ))}
              </div>

              {/* Text Content */}
              <div className="text-left ">
                <h3 className="text-2xl font-semibold mb-3 text-cyan-400">
                  Built for Every Operation
                </h3>
                <ul className="list-disc list-inside space-y-2 text-gray-300">
                  <li>600+ modules for system observability</li>
                  <li>Real-time diagnostics with intuitive UI</li>
                  <li>Red and Blue team ready tools</li>
                  <li>Privacy-respecting, open-source core</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="py-16 px-4 text-white text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-10">Why Obi‑Watch‑Kenobi?</h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
              {/* Card 1: System Security */}
              <div className="bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-cyan-500/30 transition-shadow duration-300">
                <ShieldCheck className="w-8 h-8 mx-auto text-cyan-400 mb-3" />
                <h3 className="text-xl font-semibold text-cyan-400 mb-2">System Security</h3>
                <p className="text-gray-300">Robust defense against threats with real-time monitoring and AI-driven anomaly detection.</p>
              </div>

              {/* Card 2: Portability */}
              <div className="bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-cyan-500/30 transition-shadow duration-300">
                <Laptop2 className="w-8 h-8 mx-auto text-cyan-400 mb-3" />
                <h3 className="text-xl font-semibold text-cyan-400 mb-2">Portability</h3>
                <p className="text-gray-300">Lightweight and container-friendly—deploy anywhere from edge devices to enterprise cloud.</p>
              </div>

              {/* Card 3: Compatibility (Linux Servers) */}
              <div className="bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-cyan-500/30 transition-shadow duration-300">
                <Server className="w-8 h-8 mx-auto text-cyan-400 mb-3" />
                <h3 className="text-xl font-semibold text-cyan-400 mb-2">Compatibility (Linux Servers)</h3>
                <p className="text-gray-300">Seamlessly integrates with all major Linux distributions and server stacks.</p>
              </div>

              {/* Card 4: Cost Effective */}
              <div className="bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-cyan-500/30 transition-shadow duration-300">
                <DollarSign className="w-8 h-8 mx-auto text-cyan-400 mb-3" />
                <h3 className="text-xl font-semibold text-cyan-400 mb-2">Cost Effective</h3>
                <p className="text-gray-300">Open-source core and scalable design reduce infrastructure and licensing costs.</p>
              </div>

              {/* Card 5: Privacy */}
              <div className="bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-cyan-500/30 transition-shadow duration-300">
                <EyeOff className="w-8 h-8 mx-auto text-cyan-400 mb-3" />
                <h3 className="text-xl font-semibold text-cyan-400 mb-2">Privacy</h3>
                <p className="text-gray-300">Your data stays yours—no hidden tracking or analytics. Fully GDPR-compliant.</p>
              </div>

              {/* Card 6: Easy to Maintain */}
              <div className="bg-slate-800 rounded-xl p-6 shadow-lg hover:shadow-cyan-500/30 transition-shadow duration-300">
                <Wrench className="w-8 h-8 mx-auto text-cyan-400 mb-3" />
                <h3 className="text-xl font-semibold text-cyan-400 mb-2">Easy to Maintain</h3>
                <p className="text-gray-300">Simple configuration, auto-updates, and developer-friendly CLI tools streamline operations.</p>
              </div>
            </div>
          </div>
          <div className="py-8 px-4 text-white">
            <h2 className="text-2xl font-semibold text-center mb-6">Developed Using</h2>

            <div className="flex flex-wrap items-center justify-center gap-20 max-w-6xl mx-auto">
              {/* <div className="flex flex-col items-center">
                <img src="/tech/js.svg" alt="js" className="w-12 h-12 mb-2" />
                <span className="text-sm text-gray-300">js</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/tech/py.svg" alt="py" className="w-12 h-12 mb-2" />
                <span className="text-sm text-gray-300">py</span>
              </div>
              <div className="flex flex-col items-center">
                <img src="/tech/bash.svg" alt="bash" className="w-12 h-12 mb-2" />
                <span className="text-sm text-gray-300">bash</span>
              </div> */}

              {/* React */}
              <div className="flex flex-col items-center">
                <img src="/tech/react.svg" alt="React" className="w-12 h-12 mb-2" />
                <span className="text-sm text-gray-300">React</span>
              </div>

              {/* Tailwind */}
              <div className="flex flex-col items-center">
                <img src="/tech/tailwind.svg" alt="Tailwind" className="w-12 h-12 mb-2" />
                <span className="text-sm text-gray-300">Tailwind</span>
              </div>

              {/* Flask */}
              <div className="flex flex-col items-center">
                <img src="/tech/flask.svg" alt="Flask" className="w-12 h-12 mb-2" />
                <span className="text-sm text-gray-300">Flask</span>
              </div>
              {/* Linux */}
              <div className="flex flex-col items-center">
                <img src="/tech/linux.svg" alt="Linux" className="w-12 h-12 mb-2" />
                <span className="text-sm text-gray-300">Linux</span>
              </div>
              {/* ZeroTier */}
              <div className="flex flex-col items-center">
                <img src="/tech/zero-tier.svg" alt="ZeroTier" className="w-12 h-12 mb-2" />
                <span className="text-sm text-gray-300">ZeroTier</span>
              </div>



              {/* Gemini */}
              <div className="flex flex-col items-center">
                <img src="/tech/gemini.svg" alt="Gemini" className="w-12 h-12 mb-2" />
                <span className="text-sm text-gray-300">Gemini</span>
              </div>
            </div>
          </div>

          <div className=" py-20 px-6 text-white">
            <div className="max-w-5xl mx-auto text-center border border-[#1f1f1f] p-10 rounded-2xl shadow-xl bg-[#0a0a0a4b]">

              {/* Gemini Logo SVG */}
              <img src="Google_Gemini_logo.svg" alt="Gemini Logo" className="w-36 h-36 mx-auto mb-6" />

              {/* Title */}
              <h2 className="text-4xl font-bold mb-4 text-white">🔮 <span className="bg-gradient-to-r from-[#4285F4] via-[#6858c4] to-[#EA4335] text-transparent bg-clip-text">What is Gemini?</span></h2>

              {/* Gemini Description */}
              <p className="text-lg text-gray-300 mb-10 leading-relaxed">
                <span className="font-semibold text-white">Gemini</span> is Google’s frontier AI model — built for multimodal reasoning across text, code, and media. ✨
                It understands context deeply and generates human-like responses, insights, and solutions. 🌐
              </p>

              {/* API Usage */}
              <div className=" border border-[#222] rounded-xl p-8 text-left">
                <h3 className="text-2xl font-semibold mb-4 "> <span className="bg-gradient-to-r from-[#4285F4] via-[#6858c4] to-[#EA4335] text-transparent bg-clip-text">⚙️ How We Use Gemini</span> </h3>
                <p className="text-gray-300 mb-4">
                  <span className="text-white font-semibold">Obi‑Watch‑Kenobi</span> integrates the Gemini API to enable AI-powered insights, automation, and system intelligence:
                </p>
                <ul className="list-disc list-inside space-y-3 pl-2 text-gray-300">
                  <li>🧠 <span className="font-black text-white">Smart Monitoring</span> — Gemini provides intelligent insights into system health.</li>
                  <li>📜 <span className="font-black text-white">Log Analysis</span> — Converts raw logs into summarized human-readable reports.</li>
                  <li>⚡ <span className="font-black text-white">Instant Fixes</span> — Generates CLI commands and config suggestions in real-time.</li>
                  <li>🔐 <span className="font-black text-white">Secure API</span> — Token-based communication keeps everything private and safe.</li>
                </ul>
              </div>
            </div>
          </div>



        </div>
      )}

    </div>
  );
}

export default Home;
