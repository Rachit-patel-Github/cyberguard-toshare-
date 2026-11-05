import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Mail, MessageSquare, MapPin, Clock, Send,
  Loader2, CheckCircle, ChevronDown, ChevronUp, HelpCircle
} from "lucide-react";

import { useToast } from "@/components/ui/use-toast";
import GlowCard from "@/components/cyber/GlowCard";
import { db } from "@/api/base44Client";

const faqs = [
  { q: "How does CyberGuard AI detect scams?", a: "We use advanced AI models trained on millions of scam patterns, combined with real-time threat intelligence from our global network. Our system analyzes URLs, email headers, phone number databases, message patterns, and visual elements to identify potential threats." },
  { q: "Is my data safe when I use the scanner?", a: "Absolutely. We use end-to-end encryption and never store your personal data beyond what's needed for the scan. All scan data is automatically purged after 30 days." },
  { q: "Can I use CyberGuard AI for my business?", a: "Yes! Our Enterprise plan includes team management, API access, custom threat rules, and a dedicated business dashboard. Contact our sales team for a demo." },
  { q: "How accurate is the threat detection?", a: "Our AI maintains a 99.7% detection rate across all scanner types, continuously improving through machine learning and community feedback." },
  { q: "Do you offer a free plan?", a: "Yes, our free plan includes 5 AI scans per day, basic threat detection, and community scam alerts." },
  { q: "What platforms are supported?", a: "CyberGuard AI works on all modern web browsers, and we offer native apps for iOS and Android with additional features like QR code camera scanning." },
];

export default function Contact() {
  const { toast } = useToast();
  const [form, setForm] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.subject || !form.message) return;
    setIsSubmitting(true);
    try {
      await db.entities.ContactMessage.create(form);
      setSubmitted(true);
      toast({ title: "Message sent!", description: "We'll get back to you within 24 hours." });
    } catch {
      toast({ title: "Error", description: "Failed to send message. Please try again.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-4 block">Get in Touch</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Contact Us</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Have questions or need help? We're here to assist you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 mb-20">
          {/* Contact Info */}
          <div className="lg:col-span-2 space-y-4">
            {[
              { icon: Mail, label: "Email", value: "support@cyberguard.ai", color: "text-cyan-400", bg: "bg-cyan-400/10" },
              { icon: MessageSquare, label: "Live Chat", value: "Available 24/7", color: "text-blue-400", bg: "bg-blue-400/10" },
              { icon: Clock, label: "Response Time", value: "Within 24 hours", color: "text-purple-400", bg: "bg-purple-400/10" },
              { icon: MapPin, label: "Headquarters", value: "San Francisco, CA", color: "text-emerald-400", bg: "bg-emerald-400/10" },
            ].map((info, i) => (
              <GlowCard key={i} delay={i * 0.1}>
                <div className="p-5 flex items-center gap-4">
                  <div className={`w-10 h-10 rounded-xl ${info.bg} flex items-center justify-center flex-shrink-0`}>
                    <info.icon className={`w-5 h-5 ${info.color}`} />
                  </div>
                  <div>
                    <p className="text-slate-500 text-xs">{info.label}</p>
                    <p className="text-white text-sm font-medium">{info.value}</p>
                  </div>
                </div>
              </GlowCard>
            ))}
          </div>

          {/* Form */}
          <div className="lg:col-span-3">
            <div className="glass rounded-2xl p-6 sm:p-8">
              {submitted ? (
                <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
                  <CheckCircle className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-white text-xl font-semibold mb-2">Message Sent!</h3>
                  <p className="text-slate-400 text-sm">We'll get back to you within 24 hours.</p>
                  <button onClick={() => { setSubmitted(false); setForm({ name: "", email: "", subject: "", message: "" }); }} className="mt-6 text-cyan-400 text-sm font-medium hover:text-cyan-300 transition-colors">
                    Send another message
                  </button>
                </motion.div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-slate-400 text-xs mb-1.5 block">Name</label>
                      <input
                        type="text"
                        value={form.name}
                        onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/40 text-sm"
                        placeholder="Your name"
                        required
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 text-xs mb-1.5 block">Email</label>
                      <input
                        type="email"
                        value={form.email}
                        onChange={(e) => setForm(f => ({ ...f, email: e.target.value }))}
                        className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/40 text-sm"
                        placeholder="you@email.com"
                        required
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1.5 block">Subject</label>
                    <input
                      type="text"
                      value={form.subject}
                      onChange={(e) => setForm(f => ({ ...f, subject: e.target.value }))}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/40 text-sm"
                      placeholder="How can we help?"
                      required
                    />
                  </div>
                  <div>
                    <label className="text-slate-400 text-xs mb-1.5 block">Message</label>
                    <textarea
                      value={form.message}
                      onChange={(e) => setForm(f => ({ ...f, message: e.target.value }))}
                      rows={5}
                      className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/40 text-sm resize-none"
                      placeholder="Tell us more..."
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full py-3.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-sm hover:from-cyan-400 hover:to-blue-400 disabled:opacity-40 transition-all flex items-center justify-center gap-2"
                  >
                    {isSubmitting ? (
                      <><Loader2 className="w-4 h-4 animate-spin" /> Sending...</>
                    ) : (
                      <><Send className="w-4 h-4" /> Send Message</>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>

        {/* FAQ */}
        <div>
          <div className="flex items-center gap-3 mb-8">
            <HelpCircle className="w-6 h-6 text-cyan-400" />
            <h2 className="text-2xl font-bold text-white">Frequently Asked Questions</h2>
          </div>
          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <GlowCard key={i}>
                <button
                  onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4"
                >
                  <span className="text-white text-sm font-medium">{faq.q}</span>
                  {expandedFaq === i ? (
                    <ChevronUp className="w-4 h-4 text-cyan-400 flex-shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                  )}
                </button>
                {expandedFaq === i && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    className="px-5 pb-5"
                  >
                    <p className="text-slate-400 text-sm leading-relaxed">{faq.a}</p>
                  </motion.div>
                )}
              </GlowCard>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
