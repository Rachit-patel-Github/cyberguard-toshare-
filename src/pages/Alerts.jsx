import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  AlertTriangle, Landmark, Smartphone, Briefcase, TrendingUp,
  MessageCircle, Mail, Users, QrCode, Shield, Clock, ChevronRight
} from "lucide-react";

import GlowCard from "@/components/cyber/GlowCard";
import { db } from "@/api/base44Client";

const categoryMeta = {
  banking: { icon: Landmark, color: "text-red-400", bg: "bg-red-400/10", label: "Banking Scam" },
  upi: { icon: Smartphone, color: "text-orange-400", bg: "bg-orange-400/10", label: "UPI Scam" },
  fake_job: { icon: Briefcase, color: "text-yellow-400", bg: "bg-yellow-400/10", label: "Fake Job" },
  investment: { icon: TrendingUp, color: "text-amber-400", bg: "bg-amber-400/10", label: "Investment Scam" },
  whatsapp: { icon: MessageCircle, color: "text-green-400", bg: "bg-green-400/10", label: "WhatsApp Scam" },
  email_phishing: { icon: Mail, color: "text-blue-400", bg: "bg-blue-400/10", label: "Email Phishing" },
  social_media: { icon: Users, color: "text-purple-400", bg: "bg-purple-400/10", label: "Social Media" },
  qr_code: { icon: QrCode, color: "text-cyan-400", bg: "bg-cyan-400/10", label: "QR Code Scam" },
};

const severityStyles = {
  low: "text-green-400 bg-green-400/10",
  medium: "text-yellow-400 bg-yellow-400/10",
  high: "text-orange-400 bg-orange-400/10",
  critical: "text-red-400 bg-red-400/10 animate-pulse",
};

// Default alerts shown when no data exists
const defaultAlerts = [
  { id: "d1", title: "Fake Banking OTP SMS Campaign", category: "banking", description: "A large-scale SMS phishing campaign is targeting users with fake OTP messages pretending to be from major banks. Never share your OTP with anyone.", severity: "critical", source: "CyberGuard AI Threat Intel", created_date: new Date().toISOString() },
  { id: "d2", title: "Crypto Investment Scam on Telegram", category: "investment", description: "Scammers are creating fake Telegram groups promising 500% returns on cryptocurrency investments. These groups use bot members and fake testimonials.", severity: "high", source: "User Reports", created_date: new Date().toISOString() },
  { id: "d3", title: "Fake Job Offers via LinkedIn", category: "fake_job", description: "Fraudulent recruiters are sending fake job offers through LinkedIn, requesting upfront fees for background checks or training materials.", severity: "high", source: "CyberGuard AI Analysis", created_date: new Date().toISOString() },
  { id: "d4", title: "WhatsApp Gift Card Phishing", category: "whatsapp", description: "Messages claiming you've won a gift card are circulating on WhatsApp. The links lead to phishing pages designed to steal personal information.", severity: "medium", source: "Community Reports", created_date: new Date().toISOString() },
  { id: "d5", title: "Fake Government Tax Email", category: "email_phishing", description: "Phishing emails impersonating tax authorities are demanding immediate payment. Official agencies never request payment via email.", severity: "critical", source: "CyberGuard AI Threat Intel", created_date: new Date().toISOString() },
  { id: "d6", title: "Malicious QR Codes on Parking Meters", category: "qr_code", description: "Scammers are placing fake QR code stickers on public parking meters that redirect to phishing payment pages.", severity: "medium", source: "Law Enforcement", created_date: new Date().toISOString() },
  { id: "d7", title: "Instagram Impersonation Scam", category: "social_media", description: "Verified account impersonation on Instagram is on the rise. Scammers create near-identical profiles to trick followers into sending money.", severity: "high", source: "CyberGuard AI Analysis", created_date: new Date().toISOString() },
  { id: "d8", title: "UPI Payment Request Fraud", category: "upi", description: "Scammers send UPI collect requests disguised as refunds. Always verify payment requests before accepting them.", severity: "high", source: "User Reports", created_date: new Date().toISOString() },
];

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");

  useEffect(() => {
    db.entities.ScamAlert.list("-created_date", 50)
      .then(data => setAlerts(data.length > 0 ? data : defaultAlerts))
      .catch(() => setAlerts(defaultAlerts))
      .finally(() => setLoading(false));
  }, []);

  const filteredAlerts = filter === "all" ? alerts : alerts.filter(a => a.category === filter);

  if (loading) {
    return (
      <div className="min-h-screen pt-24 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-cyan-500/20 border-t-cyan-500 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-10">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-red-400/10 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5 text-red-400" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white">Live Scam Alerts</h1>
              <p className="text-slate-400 text-sm">Real-time cyber threat intelligence</p>
            </div>
          </div>
        </motion.div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setFilter("all")}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              filter === "all" ? "bg-cyan-400/10 text-cyan-400 border border-cyan-400/30" : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
            }`}
          >
            All
          </button>
          {Object.entries(categoryMeta).map(([key, meta]) => (
            <button
              key={key}
              onClick={() => setFilter(key)}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
                filter === key ? `${meta.bg} ${meta.color} border border-current/30` : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <meta.icon className="w-3.5 h-3.5" />
              {meta.label}
            </button>
          ))}
        </div>

        {/* Alerts */}
        <div className="space-y-4">
          {filteredAlerts.map((alert, i) => {
            const meta = categoryMeta[alert.category] || categoryMeta.banking;
            const sevStyle = severityStyles[alert.severity] || severityStyles.medium;
            return (
              <GlowCard key={alert.id} delay={i * 0.05}>
                <div className="p-5 sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl ${meta.bg} flex items-center justify-center flex-shrink-0`}>
                      <meta.icon className={`w-5 h-5 ${meta.color}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-3 mb-2">
                        <h3 className="text-white font-semibold text-sm sm:text-base">{alert.title}</h3>
                        <span className={`text-xs font-semibold px-2.5 py-1 rounded-full flex-shrink-0 capitalize ${sevStyle}`}>
                          {alert.severity}
                        </span>
                      </div>
                      <p className="text-slate-400 text-sm leading-relaxed mb-3">{alert.description}</p>
                      <div className="flex items-center gap-4 text-xs text-slate-500">
                        <span className="flex items-center gap-1">
                          <Shield className="w-3 h-3" />
                          {alert.source || "CyberGuard AI"}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          Recently reported
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </GlowCard>
            );
          })}
        </div>
      </div>
    </div>
  );
}
