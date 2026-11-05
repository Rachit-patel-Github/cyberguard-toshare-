import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Shield, Zap, Globe, Phone, Mail, MessageSquare,
  QrCode, Camera, ArrowRight, CheckCircle, TrendingUp,
  Lock, Eye, AlertTriangle, Users, BarChart3
} from "lucide-react";
import ParticleField from "@/components/cyber/ParticleField";
import GlowCard from "@/components/cyber/GlowCard";

const scannerFeatures = [
  { icon: Globe, title: "Website Scanner", desc: "Detect phishing sites, check domain reputation & SSL", color: "text-cyan-400", bg: "bg-cyan-400/10" },
  { icon: Phone, title: "Phone Scanner", desc: "Identify spam calls, fraud reports & carrier info", color: "text-blue-400", bg: "bg-blue-400/10" },
  { icon: Mail, title: "Email Scanner", desc: "Spot fake emails, disposable domains & phishing", color: "text-purple-400", bg: "bg-purple-400/10" },
  { icon: MessageSquare, title: "Message Scanner", desc: "Analyze SMS, WhatsApp & Telegram messages", color: "text-emerald-400", bg: "bg-emerald-400/10" },
  { icon: QrCode, title: "QR Code Scanner", desc: "Verify QR destinations before opening", color: "text-amber-400", bg: "bg-amber-400/10" },
  { icon: Camera, title: "Screenshot Scanner", desc: "AI-powered visual detection of scam content", color: "text-rose-400", bg: "bg-rose-400/10" },
];

const stats = [
  { value: "10M+", label: "Scans Completed" },
  { value: "99.7%", label: "Detection Rate" },
  { value: "150+", label: "Countries Protected" },
  { value: "<1s", label: "Avg Analysis Time" },
];

const trustFeatures = [
  { icon: Lock, title: "End-to-End Encrypted", desc: "Your data never leaves our secure environment" },
  { icon: Eye, title: "Privacy First", desc: "We don't store or share your personal information" },
  { icon: TrendingUp, title: "Real-Time Updates", desc: "Threat database updated every 60 seconds" },
  { icon: Users, title: "Community Powered", desc: "Leveraging reports from millions of users worldwide" },
];

export default function Home() {
  return (
    <div className="min-h-screen">
      {/* Hero */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
        <ParticleField count={40} />
        
        {/* Hero glow */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px]" />
        <div className="absolute bottom-1/3 right-1/4 w-[300px] h-[300px] bg-blue-500/8 rounded-full blur-[100px]" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass border border-cyan-500/20 mb-8"
            >
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="text-cyan-400 text-sm font-medium">AI-Powered Cybersecurity for Everyone</span>
            </motion.div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight mb-6 tracking-tight">
              <span className="text-white">Protect Yourself from</span>
              <br />
              <span className="bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                Online Scams with AI
              </span>
            </h1>

            <p className="text-slate-400 text-lg sm:text-xl max-w-2xl mx-auto mb-10 leading-relaxed">
              CyberGuard AI instantly analyzes websites, phone numbers, email addresses, 
              QR codes, messages, and screenshots to identify scams before they cause harm.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                to="/scanner"
                className="group flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-lg hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 glow-blue"
              >
                <Shield className="w-5 h-5" />
                Analyze Now
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                to="/assistant"
                className="flex items-center gap-2 px-8 py-4 rounded-2xl glass border border-cyan-500/20 text-white font-semibold text-lg hover:border-cyan-500/40 hover:bg-cyan-500/5 transition-all duration-300"
              >
                <Zap className="w-5 h-5 text-cyan-400" />
                AI Assistant
              </Link>
            </div>
          </motion.div>

          {/* Stats */}
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6"
          >
            {stats.map((stat, i) => (
              <div key={i} className="glass rounded-2xl p-6 text-center">
                <p className="text-2xl sm:text-3xl font-bold text-cyan-400 glow-text font-mono">{stat.value}</p>
                <p className="text-slate-500 text-sm mt-1">{stat.label}</p>
              </div>
            ))}
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <motion.div
          className="absolute bottom-8 left-1/2 -translate-x-1/2"
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <div className="w-6 h-10 rounded-full border-2 border-cyan-500/30 flex justify-center pt-2">
            <div className="w-1.5 h-3 rounded-full bg-cyan-400/60" />
          </div>
        </motion.div>
      </section>

      {/* Scanner Features */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-4 block">Security Scanner</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Six Powerful AI Scanners
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Comprehensive threat detection across every attack vector
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {scannerFeatures.map((f, i) => (
              <GlowCard key={i} delay={i * 0.1}>
                <Link to="/scanner" className="block p-6 sm:p-8">
                  <div className={`w-12 h-12 rounded-xl ${f.bg} flex items-center justify-center mb-5`}>
                    <f.icon className={`w-6 h-6 ${f.color}`} />
                  </div>
                  <h3 className="text-white text-lg font-semibold mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                  <div className="mt-4 flex items-center gap-1 text-cyan-400 text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity">
                    Scan Now <ArrowRight className="w-4 h-4" />
                  </div>
                </Link>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* Trust & Security */}
      <section className="py-24 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-cyan-500/3 to-transparent" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <span className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-4 block">Why CyberGuard</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Built for Trust & Security
            </h2>
            <p className="text-slate-400 text-lg max-w-xl mx-auto">
              Enterprise-grade protection accessible to everyone
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {trustFeatures.map((f, i) => (
              <GlowCard key={i} delay={i * 0.1}>
                <div className="p-6 text-center">
                  <div className="w-14 h-14 rounded-2xl bg-cyan-400/10 flex items-center justify-center mx-auto mb-5">
                    <f.icon className="w-7 h-7 text-cyan-400" />
                  </div>
                  <h3 className="text-white font-semibold mb-2">{f.title}</h3>
                  <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-3xl p-10 sm:p-16 relative overflow-hidden"
          >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] h-[200px] bg-cyan-500/10 rounded-full blur-[80px]" />
            <div className="relative z-10">
              <AlertTriangle className="w-12 h-12 text-cyan-400 mx-auto mb-6" />
              <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
                Don't Wait Until It's Too Late
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-lg mx-auto">
                Start protecting yourself today with CyberGuard AI's intelligent threat detection.
              </p>
              <Link
                to="/scanner"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-2xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-lg hover:from-cyan-400 hover:to-blue-400 transition-all duration-300 glow-blue"
              >
                <Shield className="w-5 h-5" />
                Start Free Scan
                <ArrowRight className="w-5 h-5" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}