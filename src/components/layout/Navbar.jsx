import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { Shield, Menu, X, Zap } from "lucide-react";

const navLinks = [
  { label: "Home", path: "/" },
  { label: "Scanner", path: "/scanner" },
  { label: "Dashboard", path: "/dashboard" },
  { label: "Alerts", path: "/alerts" },
  { label: "Pricing", path: "/pricing" },
  { label: "About", path: "/about" },
  { label: "Contact", path: "/contact" },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setIsOpen(false); }, [location.pathname]);

  return (
    <motion.nav
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-strong shadow-lg shadow-cyan-500/5" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          <Link to="/" className="flex items-center gap-2.5 group">
            <div className="relative">
              <Shield className="w-8 h-8 text-cyan-400 transition-all group-hover:text-cyan-300" />
              <div className="absolute inset-0 w-8 h-8 bg-cyan-400/20 rounded-full blur-lg group-hover:bg-cyan-400/30 transition-all" />
            </div>
            <span className="text-xl font-bold tracking-tight">
              <span className="text-white">Cyber</span>
              <span className="text-cyan-400">Guard</span>
              <span className="text-cyan-300/60 text-sm font-medium ml-1">AI</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={link.path}
                className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-300 ${
                  location.pathname === link.path
                    ? "text-cyan-400 bg-cyan-400/10"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                {link.label}
              </Link>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-3">
            <Link
              to="/assistant"
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 glow-blue-sm"
            >
              <Zap className="w-4 h-4" />
              AI Assistant
            </Link>
          </div>

          {/* Mobile toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="lg:hidden p-2 rounded-lg text-slate-400 hover:text-white hover:bg-white/5"
          >
            {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="lg:hidden glass-strong border-t border-cyan-500/10 overflow-hidden"
          >
            <div className="px-4 py-4 space-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={link.path}
                  className={`block px-4 py-3 rounded-lg text-sm font-medium transition-all ${
                    location.pathname === link.path
                      ? "text-cyan-400 bg-cyan-400/10"
                      : "text-slate-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  {link.label}
                </Link>
              ))}
              <Link
                to="/assistant"
                className="flex items-center justify-center gap-2 mt-3 px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold"
              >
                <Zap className="w-4 h-4" />
                AI Assistant
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}