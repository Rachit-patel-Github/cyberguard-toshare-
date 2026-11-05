import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Shield, Check, X, Zap, Crown, Building2, ArrowRight, Sparkles
} from "lucide-react";
import GlowCard from "@/components/cyber/GlowCard";

const plans = [
  {
    name: "Free",
    price: { monthly: 0, yearly: 0 },
    description: "Basic protection for casual users",
    icon: Shield,
    color: "text-slate-400",
    bg: "bg-slate-400/10",
    features: [
      { text: "5 AI scans per day", included: true },
      { text: "Basic threat detection", included: true },
      { text: "Community scam alerts", included: true },
      { text: "Advanced threat intelligence", included: false },
      { text: "Real-time monitoring", included: false },
      { text: "Family protection", included: false },
      { text: "API access", included: false },
      { text: "Priority support", included: false },
    ],
    cta: "Get Started",
    popular: false,
  },
  {
    name: "Pro",
    price: { monthly: 9.99, yearly: 7.99 },
    description: "Advanced protection for individuals",
    icon: Zap,
    color: "text-cyan-400",
    bg: "bg-cyan-400/10",
    features: [
      { text: "Unlimited AI scans", included: true },
      { text: "Advanced threat intelligence", included: true },
      { text: "Real-time monitoring", included: true },
      { text: "AI fraud reports", included: true },
      { text: "Family protection (up to 5)", included: true },
      { text: "Screenshot AI analysis", included: true },
      { text: "Priority email support", included: true },
      { text: "API access", included: false },
      { text: "Business dashboard", included: false },
    ],
    cta: "Start Free Trial",
    popular: true,
  },
  {
    name: "Enterprise",
    price: { monthly: 49.99, yearly: 39.99 },
    description: "Complete protection for businesses",
    icon: Building2,
    color: "text-purple-400",
    bg: "bg-purple-400/10",
    features: [
      { text: "Everything in Pro", included: true },
      { text: "Unlimited team members", included: true },
      { text: "Business dashboard", included: true },
      { text: "API access & webhooks", included: true },
      { text: "Custom threat rules", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "SLA guarantee", included: true },
      { text: "Custom integrations", included: true },
      { text: "24/7 priority support", included: true },
    ],
    cta: "Contact Sales",
    popular: false,
  },
];

export default function Pricing() {
  const [isYearly, setIsYearly] = useState(false);

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-4 block">Pricing</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Choose Your Protection Level</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto mb-8">
            Start free, upgrade when you need more. All plans include AI-powered threat detection.
          </p>

          {/* Toggle */}
          <div className="inline-flex items-center gap-4 glass rounded-full p-1.5">
            <button
              onClick={() => setIsYearly(false)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                !isYearly ? "bg-cyan-500 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Monthly
            </button>
            <button
              onClick={() => setIsYearly(true)}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2 ${
                isYearly ? "bg-cyan-500 text-white" : "text-slate-400 hover:text-white"
              }`}
            >
              Yearly
              <span className="text-xs bg-green-400/20 text-green-400 px-2 py-0.5 rounded-full">-20%</span>
            </button>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.15 }}
              className={`relative ${plan.popular ? "md:-mt-4 md:mb-4" : ""}`}
            >
              {plan.popular && (
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
                  <span className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-xs font-semibold">
                    <Sparkles className="w-3 h-3" />
                    Most Popular
                  </span>
                </div>
              )}
              <div className={`glass rounded-2xl p-6 sm:p-8 h-full flex flex-col ${
                plan.popular ? "border border-cyan-500/30 glow-blue-sm" : ""
              }`}>
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-10 h-10 rounded-xl ${plan.bg} flex items-center justify-center`}>
                    <plan.icon className={`w-5 h-5 ${plan.color}`} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-lg">{plan.name}</h3>
                    <p className="text-slate-500 text-xs">{plan.description}</p>
                  </div>
                </div>

                <div className="mb-6">
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-bold text-white font-mono">
                      ${isYearly ? plan.price.yearly : plan.price.monthly}
                    </span>
                    {plan.price.monthly > 0 && (
                      <span className="text-slate-500 text-sm mb-1">/month</span>
                    )}
                  </div>
                  {isYearly && plan.price.monthly > 0 && (
                    <p className="text-green-400 text-xs mt-1">
                      Save ${((plan.price.monthly - plan.price.yearly) * 12).toFixed(0)}/year
                    </p>
                  )}
                </div>

                <ul className="space-y-3 mb-8 flex-1">
                  {plan.features.map((f, j) => (
                    <li key={j} className="flex items-center gap-3">
                      {f.included ? (
                        <Check className={`w-4 h-4 flex-shrink-0 ${plan.color}`} />
                      ) : (
                        <X className="w-4 h-4 flex-shrink-0 text-slate-600" />
                      )}
                      <span className={`text-sm ${f.included ? "text-slate-300" : "text-slate-600"}`}>
                        {f.text}
                      </span>
                    </li>
                  ))}
                </ul>

                <button className={`w-full py-3.5 rounded-xl font-semibold text-sm transition-all flex items-center justify-center gap-2 ${
                  plan.popular
                    ? "bg-gradient-to-r from-cyan-500 to-blue-500 text-white hover:from-cyan-400 hover:to-blue-400 glow-blue-sm"
                    : "glass border border-white/10 text-white hover:border-cyan-500/30 hover:bg-cyan-500/5"
                }`}>
                  {plan.cta}
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}