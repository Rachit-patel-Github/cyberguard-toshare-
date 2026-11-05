import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Shield, Globe, Phone, Mail, MessageSquare, QrCode,
  Camera, TrendingUp, AlertTriangle, CheckCircle, Clock,
  BarChart3, Activity
} from "lucide-react";

import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from "recharts";
import GlowCard from "@/components/cyber/GlowCard";
import RiskGauge from "@/components/cyber/RiskGauge";
import { db } from "@/api/base44Client";

const scanTypeIcons = {
  website: Globe, phone: Phone, email: Mail,
  message: MessageSquare, qr_code: QrCode, screenshot: Camera
};
const trustColors = {
  safe: "#22C55E", low_risk: "#84CC16", medium_risk: "#EAB308",
  high_risk: "#F97316", dangerous: "#EF4444"
};

export default function Dashboard() {
  const [scans, setScans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    db.entities.ScanResult.list("-created_date", 50)
      .then(setScans)
      .catch(() => setScans([]))
      .finally(() => setLoading(false));
  }, []);

  const avgRisk = scans.length ? Math.round(scans.reduce((sum, s) => sum + (s.risk_score || 0), 0) / scans.length) : 0;
  const dangerousCount = scans.filter(s => s.risk_score > 60).length;
  const safeCount = scans.filter(s => s.risk_score <= 30).length;

  // Charts data
  const typeDistribution = Object.entries(
    scans.reduce((acc, s) => { acc[s.scan_type] = (acc[s.scan_type] || 0) + 1; return acc; }, {})
  ).map(([name, value]) => ({ name: name.replace("_", " "), value }));

  const riskDistribution = [
    { name: "Safe", value: scans.filter(s => s.risk_score <= 20).length, color: "#22C55E" },
    { name: "Low", value: scans.filter(s => s.risk_score > 20 && s.risk_score <= 40).length, color: "#84CC16" },
    { name: "Medium", value: scans.filter(s => s.risk_score > 40 && s.risk_score <= 60).length, color: "#EAB308" },
    { name: "High", value: scans.filter(s => s.risk_score > 60 && s.risk_score <= 80).length, color: "#F97316" },
    { name: "Danger", value: scans.filter(s => s.risk_score > 80).length, color: "#EF4444" },
  ].filter(d => d.value > 0);

  const recentTrend = scans.slice(0, 10).reverse().map((s, i) => ({ name: `#${i + 1}`, score: s.risk_score || 0 }));

  const statsCards = [
    { icon: BarChart3, label: "Total Scans", value: scans.length, color: "text-cyan-400", bg: "bg-cyan-400/10" },
    { icon: Activity, label: "Avg Risk Score", value: avgRisk, color: "text-blue-400", bg: "bg-blue-400/10" },
    { icon: AlertTriangle, label: "Threats Found", value: dangerousCount, color: "text-red-400", bg: "bg-red-400/10" },
    { icon: CheckCircle, label: "Safe Results", value: safeCount, color: "text-green-400", bg: "bg-green-400/10" },
  ];

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <span className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-2 block">Threat Intelligence</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white">Cyber Threat Dashboard</h1>
        </motion.div>

        {scans.length === 0 ? (
          <div className="glass rounded-2xl p-16 text-center">
            <Shield className="w-16 h-16 text-cyan-400/30 mx-auto mb-4" />
            <h3 className="text-white text-xl font-semibold mb-2">No Scans Yet</h3>
            <p className="text-slate-400">Run your first scan to see threat analysis here.</p>
          </div>
        ) : (
          <>
            {/* Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {statsCards.map((s, i) => (
                <GlowCard key={i} delay={i * 0.1}>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-3">
                      <div className={`w-10 h-10 rounded-xl ${s.bg} flex items-center justify-center`}>
                        <s.icon className={`w-5 h-5 ${s.color}`} />
                      </div>
                    </div>
                    <p className="text-2xl font-bold text-white font-mono">{s.value}</p>
                    <p className="text-slate-500 text-xs mt-1">{s.label}</p>
                  </div>
                </GlowCard>
              ))}
            </div>

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Overall Risk */}
              <GlowCard>
                <div className="p-6 flex flex-col items-center">
                  <h3 className="text-white font-semibold text-sm mb-4 self-start">Overall Risk</h3>
                  <RiskGauge score={avgRisk} size={180} />
                </div>
              </GlowCard>

              {/* Risk Distribution */}
              <GlowCard>
                <div className="p-6">
                  <h3 className="text-white font-semibold text-sm mb-4">Risk Distribution</h3>
                  <ResponsiveContainer width="100%" height={160}>
                    <PieChart>
                      <Pie data={riskDistribution} dataKey="value" cx="50%" cy="50%" innerRadius={40} outerRadius={65} strokeWidth={0}>
                        {riskDistribution.map((entry, i) => (
                          <Cell key={i} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={{ background: "#0F172A", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 12, color: "#fff", fontSize: 12 }} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </GlowCard>

              {/* Risk Trend */}
              <GlowCard>
                <div className="p-6">
                  <h3 className="text-white font-semibold text-sm mb-4">Recent Scan Trend</h3>
                  <ResponsiveContainer width="100%" height={160}>
                    <AreaChart data={recentTrend}>
                      <defs>
                        <linearGradient id="riskGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#06B6D4" stopOpacity={0.3} />
                          <stop offset="95%" stopColor="#06B6D4" stopOpacity={0} />
                        </linearGradient>
                      </defs>
                      <XAxis dataKey="name" stroke="#334155" tick={{ fontSize: 10 }} />
                      <YAxis stroke="#334155" tick={{ fontSize: 10 }} domain={[0, 100]} />
                      <Tooltip contentStyle={{ background: "#0F172A", border: "1px solid rgba(6,182,212,0.2)", borderRadius: 12, color: "#fff", fontSize: 12 }} />
                      <Area type="monotone" dataKey="score" stroke="#06B6D4" fill="url(#riskGrad)" strokeWidth={2} />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </GlowCard>
            </div>

            {/* Recent Scans */}
            <GlowCard>
              <div className="p-6">
                <h3 className="text-white font-semibold mb-4">Recent Scans</h3>
                <div className="space-y-3">
                  {scans.slice(0, 8).map((scan, i) => {
                    const Icon = scanTypeIcons[scan.scan_type] || Globe;
                    const riskColor = trustColors[scan.trust_level] || "#06B6D4";
                    return (
                      <motion.div
                        key={scan.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        className="flex items-center gap-4 p-3 rounded-xl bg-white/3 hover:bg-white/5 transition-colors"
                      >
                        <div className="w-9 h-9 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0">
                          <Icon className="w-4 h-4 text-slate-400" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-white text-sm font-medium truncate">{scan.input_value}</p>
                          <p className="text-slate-500 text-xs">{scan.threat_type || scan.scan_type}</p>
                        </div>
                        <div className="flex items-center gap-3 flex-shrink-0">
                          <div className="w-16 h-1.5 rounded-full bg-white/5 overflow-hidden">
                            <motion.div
                              className="h-full rounded-full"
                              style={{ backgroundColor: riskColor }}
                              initial={{ width: 0 }}
                              animate={{ width: `${scan.risk_score || 0}%` }}
                              transition={{ duration: 1, delay: i * 0.1 }}
                            />
                          </div>
                          <span className="text-xs font-mono font-semibold w-8 text-right" style={{ color: riskColor }}>
                            {scan.risk_score || 0}
                          </span>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            </GlowCard>
          </>
        )}
      </div>
    </div>
  );
}
