import React from "react";
import { motion } from "framer-motion";

export default function GlowCard({ children, className = "", delay = 0, onClick }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      onClick={onClick}
      className={`relative rounded-2xl glass hover:glow-blue-sm transition-all duration-500 group ${onClick ? "cursor-pointer" : ""} ${className}`}
    >
      {/* Gradient border on hover */}
      <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" style={{
        background: 'linear-gradient(135deg, rgba(6,182,212,0.15), rgba(59,130,246,0.1), rgba(139,92,246,0.1))',
      }} />
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}