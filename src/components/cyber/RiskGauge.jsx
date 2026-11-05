import React from "react";
import { motion } from "framer-motion";

const getRiskColor = (score) => {
  if (score <= 20) return { color: "#22C55E", label: "Safe", bg: "bg-green-500/10" };
  if (score <= 40) return { color: "#84CC16", label: "Low Risk", bg: "bg-lime-500/10" };
  if (score <= 60) return { color: "#EAB308", label: "Medium Risk", bg: "bg-yellow-500/10" };
  if (score <= 80) return { color: "#F97316", label: "High Risk", bg: "bg-orange-500/10" };
  return { color: "#EF4444", label: "Dangerous", bg: "bg-red-500/10" };
};

export default function RiskGauge({ score = 0, size = 160 }) {
  const { color, label, bg } = getRiskColor(score);
  const radius = (size - 20) / 2;
  const circumference = Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="relative" style={{ width: size, height: size / 2 + 20 }}>
        <svg width={size} height={size / 2 + 20} className="overflow-visible">
          {/* Background arc */}
          <path
            d={`M 10 ${size / 2 + 10} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2 + 10}`}
            fill="none"
            stroke="rgba(255,255,255,0.05)"
            strokeWidth="8"
            strokeLinecap="round"
          />
          {/* Filled arc */}
          <motion.path
            d={`M 10 ${size / 2 + 10} A ${radius} ${radius} 0 0 1 ${size - 10} ${size / 2 + 10}`}
            fill="none"
            stroke={color}
            strokeWidth="8"
            strokeLinecap="round"
            strokeDasharray={circumference}
            initial={{ strokeDashoffset: circumference }}
            animate={{ strokeDashoffset }}
            transition={{ duration: 1.5, ease: "easeOut" }}
            style={{ filter: `drop-shadow(0 0 8px ${color}40)` }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
          <motion.span
            className="text-3xl font-bold font-mono"
            style={{ color }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {score}
          </motion.span>
        </div>
      </div>
      <span className={`text-xs font-semibold px-3 py-1 rounded-full ${bg}`} style={{ color }}>
        {label}
      </span>
    </div>
  );
}