import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Globe, Phone, Mail, MessageSquare, QrCode, Camera,
  Search, Shield, AlertTriangle, CheckCircle, Loader2,
  ArrowRight, Upload, X
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import GlowCard from "@/components/cyber/GlowCard";
import RiskGauge from "@/components/cyber/RiskGauge";
import { db, isBase44Configured } from "@/api/base44Client";
import { runLocalScan } from "@/lib/localCyberService";

const scanners = [
  { id: "website", icon: Globe, label: "Website", placeholder: "Paste URL (e.g., https://example.com)", color: "text-cyan-400", bg: "bg-cyan-400/10", borderColor: "border-cyan-400/30" },
  { id: "phone", icon: Phone, label: "Phone", placeholder: "Enter phone number (e.g., +1234567890)", color: "text-blue-400", bg: "bg-blue-400/10", borderColor: "border-blue-400/30" },
  { id: "email", icon: Mail, label: "Email", placeholder: "Enter email address", color: "text-purple-400", bg: "bg-purple-400/10", borderColor: "border-purple-400/30" },
  { id: "message", icon: MessageSquare, label: "Message", placeholder: "Paste the suspicious message here...", color: "text-emerald-400", bg: "bg-emerald-400/10", borderColor: "border-emerald-400/30", multiline: true },
  { id: "qr_code", icon: QrCode, label: "QR Code", placeholder: "Upload QR code image", color: "text-amber-400", bg: "bg-amber-400/10", borderColor: "border-amber-400/30", isUpload: true },
  { id: "screenshot", icon: Camera, label: "Screenshot", placeholder: "Upload screenshot image", color: "text-rose-400", bg: "bg-rose-400/10", borderColor: "border-rose-400/30", isUpload: true },
];

export default function Scanner() {
  const [activeScanner, setActiveScanner] = useState("website");
  const [inputValue, setInputValue] = useState("");
  const [uploadedFile, setUploadedFile] = useState(null);
  const [isScanning, setIsScanning] = useState(false);
  const [result, setResult] = useState(null);
  const fileInputRef = useRef(null);

  const currentScanner = scanners.find(s => s.id === activeScanner);

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploadedFile(file);
    setInputValue(file.name);
  };

  const handleScan = async () => {
    if (!inputValue.trim()) return;
    setIsScanning(true);
    setResult(null);

    try {
      if (!isBase44Configured) {
        const localResult = await runLocalScan(activeScanner, inputValue);
        const scanResult = { scan_type: activeScanner, input_value: inputValue, ...localResult, file_url: null };
        await db.entities.ScanResult.create(scanResult);
        setResult(scanResult);
        return;
      }
      if (activeScanner === "website") {
        const reputationResponse = await db.functions.invoke("live-reputation", { url: inputValue });
        const reputation = reputationResponse.data;
        if (reputation?.available) {
          const scanResult = { scan_type: activeScanner, input_value: inputValue, ...reputation, file_url: null };
          await db.entities.ScanResult.create(scanResult);
          setResult(scanResult);
          return;
        }
      }
      let fileUrl = null;
      if (uploadedFile) {
        const uploadRes = await db.integrations.Core.UploadFile({ file: uploadedFile });
        fileUrl = uploadRes.file_url;
      }

      const scanTypeLabels = {
        website: "website URL", phone: "phone number", email: "email address",
        message: "message", qr_code: "QR code", screenshot: "screenshot"
      };

      const prompt = currentScanner.isUpload
        ? `Analyze this ${scanTypeLabels[activeScanner]} for cybersecurity threats. Provide a detailed security analysis including: risk_score (0-100, where 0 is completely safe and 100 is extremely dangerous), trust_level (safe/low_risk/medium_risk/high_risk/dangerous), threat_type (specific threat category), ai_explanation (detailed explanation of findings), recommended_action (what the user should do), and details (JSON string with specific technical findings like domain_age, ssl_status, reputation_score etc). The file/image was uploaded for analysis.`
        : `Analyze this ${scanTypeLabels[activeScanner]} for cybersecurity threats: "${inputValue}". Provide a detailed security analysis including: risk_score (0-100, where 0 is completely safe and 100 is extremely dangerous), trust_level (safe/low_risk/medium_risk/high_risk/dangerous), threat_type (specific threat category), ai_explanation (detailed explanation of findings), recommended_action (what the user should do), and details (JSON string with specific technical findings).`;

      const aiResult = await db.integrations.Core.InvokeLLM({
        prompt,
        response_json_schema: {
          type: "object",
          properties: {
            risk_score: { type: "number" },
            trust_level: { type: "string" },
            threat_type: { type: "string" },
            ai_explanation: { type: "string" },
            recommended_action: { type: "string" },
            details: { type: "string" }
          }
        },
        file_urls: fileUrl ? [fileUrl] : undefined
      });

      const scanResult = {
        scan_type: activeScanner,
        input_value: inputValue,
        risk_score: aiResult.risk_score,
        trust_level: aiResult.trust_level,
        threat_type: aiResult.threat_type,
        ai_explanation: aiResult.ai_explanation,
        recommended_action: aiResult.recommended_action,
        details: aiResult.details,
        file_url: fileUrl
      };

      await db.entities.ScanResult.create(scanResult);
      setResult(scanResult);
    } catch (err) {
      const fallback = await runLocalScan(activeScanner, inputValue);
      const scanResult = { scan_type: activeScanner, input_value: inputValue, ...fallback, file_url: null };
      await db.entities.ScanResult.create(scanResult).catch(() => {});
      setResult(scanResult);
    } finally {
      setIsScanning(false);
    }
  };

  const resetScan = () => {
    setInputValue("");
    setUploadedFile(null);
    setResult(null);
  };

  const getTrustBadge = (level) => {
    const styles = {
      safe: { color: "text-green-400", bg: "bg-green-400/10", icon: CheckCircle, label: "Safe" },
      low_risk: { color: "text-lime-400", bg: "bg-lime-400/10", icon: Shield, label: "Low Risk" },
      medium_risk: { color: "text-yellow-400", bg: "bg-yellow-400/10", icon: AlertTriangle, label: "Medium Risk" },
      high_risk: { color: "text-orange-400", bg: "bg-orange-400/10", icon: AlertTriangle, label: "High Risk" },
      dangerous: { color: "text-red-400", bg: "bg-red-400/10", icon: AlertTriangle, label: "Dangerous" },
    };
    return styles[level] || styles.safe;
  };

  return (
    <div className="min-h-screen pt-24 pb-16">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <span className="text-cyan-400 text-sm font-semibold tracking-widest uppercase mb-4 block">AI Security Scanner</span>
          <h1 className="text-3xl sm:text-4xl font-bold text-white mb-4">Analyze Any Threat</h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">Choose a scanner, provide input, and let AI detect potential threats instantly.</p>
        </motion.div>

        {/* Scanner Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-10">
          {scanners.map((s) => (
            <button
              key={s.id}
              onClick={() => { setActiveScanner(s.id); resetScan(); }}
              className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 ${
                activeScanner === s.id
                  ? `${s.bg} ${s.color} ${s.borderColor} border glow-blue-sm`
                  : "text-slate-400 hover:text-white hover:bg-white/5 border border-transparent"
              }`}
            >
              <s.icon className="w-4 h-4" />
              {s.label}
            </button>
          ))}
        </div>

        {/* Input Area */}
        <motion.div layout className="glass rounded-2xl p-6 sm:p-8 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className={`w-10 h-10 rounded-xl ${currentScanner.bg} flex items-center justify-center`}>
              <currentScanner.icon className={`w-5 h-5 ${currentScanner.color}`} />
            </div>
            <div>
              <h3 className="text-white font-semibold">{currentScanner.label} Scanner</h3>
              <p className="text-slate-500 text-xs">Powered by AI threat detection</p>
            </div>
          </div>

          {currentScanner.isUpload ? (
            <div
              onClick={() => fileInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                uploadedFile ? `${currentScanner.borderColor} ${currentScanner.bg}` : "border-white/10 hover:border-white/20"
              }`}
            >
              <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
              {uploadedFile ? (
                <div className="flex items-center justify-center gap-3">
                  <CheckCircle className={`w-5 h-5 ${currentScanner.color}`} />
                  <span className="text-white">{uploadedFile.name}</span>
                  <button onClick={(e) => { e.stopPropagation(); resetScan(); }} className="text-slate-400 hover:text-white">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <>
                  <Upload className={`w-8 h-8 ${currentScanner.color} mx-auto mb-3 opacity-60`} />
                  <p className="text-slate-400 text-sm">{currentScanner.placeholder}</p>
                  <p className="text-slate-600 text-xs mt-1">PNG, JPG, WEBP up to 10MB</p>
                </>
              )}
            </div>
          ) : currentScanner.multiline ? (
            <Textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={currentScanner.placeholder}
              rows={5}
              className="bg-white/5 border-white/10 text-white placeholder:text-slate-600 focus:border-cyan-500/40 resize-none"
            />
          ) : (
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-600" />
              <input
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleScan()}
                placeholder={currentScanner.placeholder}
                className="w-full pl-12 pr-4 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-600 focus:outline-none focus:border-cyan-500/40 transition-colors"
              />
            </div>
          )}

          <Button
            onClick={handleScan}
            disabled={!inputValue.trim() || isScanning}
            className="w-full mt-4 py-6 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-semibold text-base hover:from-cyan-400 hover:to-blue-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {isScanning ? (
              <span className="flex items-center gap-2">
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyzing...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Scan Now
              </span>
            )}
          </Button>
        </motion.div>

        {/* Results */}
        <AnimatePresence>
          {result && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Risk Score */}
              <div className="glass rounded-2xl p-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <RiskGauge score={result.risk_score} />
                  <div className="flex-1 text-center md:text-left">
                    {(() => { const badge = getTrustBadge(result.trust_level); return (
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full ${badge.bg} mb-4`}>
                        <badge.icon className={`w-4 h-4 ${badge.color}`} />
                        <span className={`text-sm font-semibold ${badge.color}`}>{badge.label}</span>
                      </div>
                    ); })()}
                    <h3 className="text-white text-xl font-bold mb-1">{result.threat_type}</h3>
                    <p className="text-slate-400 text-sm leading-relaxed">{result.ai_explanation}</p>
                  </div>
                </div>
              </div>

              {/* Recommended Action */}
              <div className="glass rounded-2xl p-6">
                <div className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-cyan-400/10 flex items-center justify-center flex-shrink-0">
                    <Shield className="w-5 h-5 text-cyan-400" />
                  </div>
                  <div>
                    <h4 className="text-white font-semibold mb-1">Recommended Action</h4>
                    <p className="text-slate-400 text-sm leading-relaxed">{result.recommended_action}</p>
                  </div>
                </div>
              </div>

              {/* New Scan */}
              <div className="text-center">
                <button onClick={resetScan} className="text-cyan-400 text-sm font-medium hover:text-cyan-300 transition-colors flex items-center gap-1 mx-auto">
                  <ArrowRight className="w-4 h-4 rotate-180" />
                  Run Another Scan
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
