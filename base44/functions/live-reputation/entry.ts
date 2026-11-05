import { secrets } from "base44:runtime";

const trustLevelFor = (score: number) => score >= 81 ? "dangerous" : score >= 61 ? "high_risk" : score >= 36 ? "medium_risk" : score >= 16 ? "low_risk" : "safe";

export default async function (req: Request) {
  try {
    const { url } = await req.json();
    if (typeof url !== "string" || url.length > 2048) {
      return Response.json({ available: false, reason: "Invalid website address." });
    }

    const apiKey = secrets.get("VIRUSTOTAL_API_KEY");
    if (!apiKey) {
      return Response.json({ available: false, reason: "Live reputation checking is not configured." });
    }

    const domain = new URL(url.includes("://") ? url : `https://${url}`).hostname.toLowerCase();
    if (!domain || domain.length > 253) {
      return Response.json({ available: false, reason: "Invalid website address." });
    }

    // Query only the hostname. This avoids sending paths, query strings, or
    // user-supplied tokens to the reputation provider.
    const response = await fetch(`https://www.virustotal.com/api/v3/domains/${encodeURIComponent(domain)}`, {
      headers: { "x-apikey": apiKey, accept: "application/json" },
    });

    if (!response.ok) {
      return Response.json({ available: false, reason: response.status === 429 ? "Live reputation rate limit reached." : "Live reputation lookup is temporarily unavailable." });
    }

    const stats = (await response.json())?.data?.attributes?.last_analysis_stats;
    if (!stats || typeof stats !== "object") {
      return Response.json({ available: false, reason: "No reputation data is available for this domain." });
    }

    const malicious = Number(stats.malicious || 0);
    const suspicious = Number(stats.suspicious || 0);
    const harmless = Number(stats.harmless || 0);
    const undetected = Number(stats.undetected || 0);
    const total = malicious + suspicious + harmless + undetected;
    if (!total) return Response.json({ available: false, reason: "No reputation data is available for this domain." });

    const score = Math.min(100, Math.round(((malicious * 100) + (suspicious * 60)) / total));
    const risky = malicious > 0 || suspicious > 0;
    return Response.json({
      available: true,
      risk_score: score,
      trust_level: trustLevelFor(score),
      threat_type: risky ? "Live reputation warning" : "No current reputation warnings",
      ai_explanation: risky
        ? `A live reputation service reports ${malicious} malicious and ${suspicious} suspicious security-engine verdicts for this domain.`
        : `A live reputation service found no malicious or suspicious verdicts across ${total} recent security-engine checks. This is not a safety guarantee.`,
      recommended_action: risky
        ? "Avoid signing in, downloading files, or sharing payment details until you independently verify the site through an official source."
        : "Continue carefully. Independently verify the destination before sharing personal information or making a payment.",
      details: JSON.stringify({ mode: "live-domain-reputation", domain, malicious, suspicious, harmless, undetected }),
    });
  } catch {
    return Response.json({ available: false, reason: "Live reputation lookup is temporarily unavailable." });
  }
}
