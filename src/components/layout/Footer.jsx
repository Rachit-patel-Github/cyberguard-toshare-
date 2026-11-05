import React from "react";
import { Link } from "react-router-dom";
import { Shield, ExternalLink } from "lucide-react";

const footerSections = [
  {
    title: "Product",
    links: [
      { label: "Scanner", path: "/scanner" },
      { label: "AI Assistant", path: "/assistant" },
      { label: "Dashboard", path: "/dashboard" },
      { label: "Pricing", path: "/pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Scam Alerts", path: "/alerts" },
      { label: "About", path: "/about" },
      { label: "Contact", path: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", path: "/about" },
      { label: "Terms of Service", path: "/about" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="relative border-t border-cyan-500/10 bg-[#060D1B]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <Shield className="w-7 h-7 text-cyan-400" />
              <span className="text-lg font-bold">
                <span className="text-white">Cyber</span>
                <span className="text-cyan-400">Guard</span>
              </span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              AI-powered cybersecurity for everyone. Making the internet safer, one scan at a time.
            </p>
            <div className="flex gap-3">
              {["LinkedIn", "X", "Instagram", "YouTube"].map((social) => (
                <span
                  key={social}
                  className="w-9 h-9 rounded-lg bg-white/5 border border-white/5 flex items-center justify-center text-slate-500 hover:text-cyan-400 hover:border-cyan-400/20 transition-all cursor-pointer text-xs font-medium"
                >
                  {social[0]}
                </span>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="text-white font-semibold text-sm mb-4 tracking-wide">{section.title}</h4>
              <ul className="space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      to={link.path}
                      className="text-slate-500 hover:text-cyan-400 text-sm transition-colors flex items-center gap-1 group"
                    >
                      {link.label}
                      <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-slate-600 text-xs">
            © {new Date().getFullYear()} CyberGuard AI. All rights reserved.
          </p>
          <p className="text-slate-600 text-xs flex items-center gap-1.5">
            Powered by <span className="text-cyan-500/60">Advanced AI</span>
          </p>
        </div>
      </div>
    </footer>
  );
}