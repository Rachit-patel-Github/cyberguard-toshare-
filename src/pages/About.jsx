import React from "react";
import { motion } from "framer-motion";
import { Shield, Target, Globe, Users, Cpu, Zap, Award, Lock } from "lucide-react";
import GlowCard from "@/components/cyber/GlowCard";

const values = [
  { icon: Shield, title: "Security First", desc: "Every decision we make starts with user safety and data protection.", color: "text-cyan-400", bg: "bg-cyan-400/10" },
  { icon: Globe, title: "Universal Access", desc: "Cybersecurity tools should be accessible to everyone, not just enterprises.", color: "text-blue-400", bg: "bg-blue-400/10" },
  { icon: Cpu, title: "AI Innovation", desc: "Leveraging cutting-edge AI to stay ahead of evolving cyber threats.", color: "text-purple-400", bg: "bg-purple-400/10" },
  { icon: Users, title: "Community Driven", desc: "Our threat intelligence is strengthened by millions of user reports worldwide.", color: "text-emerald-400", bg: "bg-emerald-400/10" },
];

const team = [
  { name: "Dr. Sarah Chen", role: "CEO & Co-Founder", desc: "Former cybersecurity lead at a Fortune 500 company with 15+ years in threat intelligence." },
  { name: "Marcus Rivera", role: "CTO & Co-Founder", desc: "AI researcher and engineer, previously built ML systems for enterprise security platforms." },
  { name: "Priya Sharma", role: "VP of Engineering", desc: "Full-stack architect specializing in scalable security infrastructure and real-time analysis." },
  { name: "James Park", role: "Head of AI Research", desc: "PhD in machine learning with publications on adversarial attack detection and NLP security." },
];

const milestones = [
  { year: "2022", event: "CyberGuard AI founded with a mission to democratize cybersecurity" },
  { year: "2023", event: "Launched AI-powered scanner with 6 detection modules" },
  { year: "2023", event: "Reached 1 million scans processed" },
  { year: "2024", event: "Expanded to 150+ countries with real-time threat intelligence" },
  { year: "2024", event: "Surpassed 10 million scans with 99.7% detection accuracy" },
];

export default function About() {
  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-20">
          <span className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-4 block">About Us</span>
          <h1 className="text-3xl sm:text-5xl font-bold text-white mb-6 leading-tight">
            Making the Internet
            <br />
            <span className="bg-gradient-to-r from-cyan-400 to-blue-400 bg-clip-text text-transparent">Safer for Everyone</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-2xl mx-auto leading-relaxed">
            CyberGuard AI is an AI-powered cybersecurity platform designed to help individuals 
            and businesses stay safe online through intelligent scam detection and security analysis.
          </p>
        </motion.div>

        {/* Mission */}
        <div className="glass rounded-3xl p-8 sm:p-12 mb-20 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/5 rounded-full blur-[80px]" />
          <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
            <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-500 flex items-center justify-center flex-shrink-0">
              <Target className="w-10 h-10 text-white" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-white mb-3">Our Mission</h2>
              <p className="text-slate-400 leading-relaxed">
                We believe that powerful cybersecurity tools shouldn't be locked behind enterprise paywalls. 
                Our mission is to democratize access to advanced AI-powered threat detection, empowering every 
                individual to navigate the digital world with confidence and safety.
              </p>
            </div>
          </div>
        </div>

        {/* Values */}
        <div className="mb-20">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-2xl font-bold text-white text-center mb-10">
            Our Core Values
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {values.map((v, i) => (
              <GlowCard key={i} delay={i * 0.1}>
                <div className="p-6 flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl ${v.bg} flex items-center justify-center flex-shrink-0`}>
                    <v.icon className={`w-6 h-6 ${v.color}`} />
                  </div>
                  <div>
                    <h3 className="text-white font-semibold mb-1">{v.title}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{v.desc}</p>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>

        {/* Team */}
        <div className="mb-20">
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-2xl font-bold text-white text-center mb-10">
            Leadership Team
          </motion.h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {team.map((member, i) => (
              <GlowCard key={i} delay={i * 0.1}>
                <div className="p-6">
                  <div className="flex items-center gap-4 mb-3">
                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-cyan-500/30 to-blue-500/30 flex items-center justify-center text-white font-bold text-lg">
                      {member.name.split(" ").map(n => n[0]).join("")}
                    </div>
                    <div>
                      <h3 className="text-white font-semibold">{member.name}</h3>
                      <p className="text-cyan-400 text-xs font-medium">{member.role}</p>
                    </div>
                  </div>
                  <p className="text-slate-400 text-sm leading-relaxed">{member.desc}</p>
                </div>
              </GlowCard>
            ))}
          </div>
        </div>

        {/* Timeline */}
        <div>
          <motion.h2 initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} className="text-2xl font-bold text-white text-center mb-10">
            Our Journey
          </motion.h2>
          <div className="space-y-4">
            {milestones.map((m, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex items-start gap-4 glass rounded-xl p-5"
              >
                <span className="text-cyan-400 font-mono font-bold text-sm flex-shrink-0 mt-0.5">{m.year}</span>
                <div className="w-2 h-2 rounded-full bg-cyan-400 flex-shrink-0 mt-2" />
                <p className="text-slate-300 text-sm">{m.event}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}