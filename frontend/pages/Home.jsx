import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { TextHoverEffect } from '../components/ui/text-hover-effect';
import { TypewriterEffectSmooth } from '../components/ui/typewriter-effect';
import { motion } from 'framer-motion';
import { TerminalSquare } from 'lucide-react';
import GlobeDemo from '../components/ui/globe';
//import { EvervaultCard } from '../components/ui/evervault-card';

function Home() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  const words = [
    { text: 'Modern' }, { text: 'SIEM' }, { text: 'System' },
    { text: 'Powered' }, { text: 'by' }, { text: 'AI-Driven'},
    { text: 'Detection'}, { text: 'and'}, { text: 'Advanced'}, { text: 'Visualisation'}
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

  const Footer = () => (
    <footer className="absolute bottom-4 text-xs text-slate-400 text-center w-full z-20">
      <p>© 2025 Obi-Watch-Kenobi by Proskywalker, Honurag Hottacharjee, Felle Kelabo and Holy Father Riyal Pope.</p>
    </footer>
  );

  return (
    <div className="flex flex-col items-center justify-center bg-black overflow-hidden relative font-mono">
      <Header />
      {isAuthenticated ? (
        <motion.div
  className="flex flex-col items-center justify-center w-full h-screen"
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
  </motion.div>

  
</motion.div>


        
      ) : (
        <div className='h-screen'>
          <GlobeDemo />
          <div className="absolute inset-0 flex flex-col items-center justify-center z-10 px-4 text-center">
            <img src="/logo.png" alt="Obi‑Watch‑Kenobi Logo" className="w-60 h-60 mb-4 animate-pulse" />
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
      )}
      <Footer />
    </div>
  );
}

export default Home;
