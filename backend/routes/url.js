const express = require("express");
const validateURL = require("../utils/urlvalidator");
const analyzeURL = require("../services/urlAnalyzer");
const getRiskLevel = require("../utils/riskscore");
const scanRedirects = require("../services/redirectScanner");
const scanDomain = require("../services/domainScanner");
const scanSSL = require("../services/sslScanner");
const scanWhois = require("../services/whoisScanner");
const scanURLhaus = require("../services/urlhausScanner");

const router = express.Router();

router.post("/scan", async (req, res) => {
  try {
    const { url } = req.body;

    if (!url) {
      return res.status(400).json({
        success: false,
        message: "URL is required",
      });
    }

    const validation = validateURL(url);

    if (!validation.valid) {
      return res.status(400).json({
        success: false,
        message: validation.reason,
      });
    }

    const analysis = analyzeURL(url);

    const redirectAnalysis = await scanRedirects(url);

    const domainAnalysis = await scanDomain(validation.hostname);

    // SSL check only for HTTPS URLs
    let sslAnalysis = {
      success: false,
      skipped: true,
      message: "SSL check skipped because URL does not use HTTPS",
    };

    if (validation.protocol === "https:") {
      sslAnalysis = await scanSSL(validation.hostname);
    }

    const whoisAnalysis = await scanWhois(validation.hostname);

    const urlhausAnalysis = await scanURLhaus(url);

    let finalScore = analysis.score;

    // Actual security problems
    if (urlhausAnalysis.success && urlhausAnalysis.found) {
      finalScore += 50;
    }
    if (sslAnalysis.skipped) {
      finalScore += 5;
    }

    if (redirectAnalysis.success && redirectAnalysis.redirectCount > 3) {
      finalScore += 10;
    }
    if (!redirectAnalysis.success) {
      finalScore += 10;
    }

    if (sslAnalysis.success && !sslAnalysis.authorized) {
      finalScore += 20;
    }

    if (!domainAnalysis.success) {
      finalScore += 15;
    }

    // Security information unavailable
    if (!whoisAnalysis.success) {
      finalScore += 10;
    }

    if (!urlhausAnalysis.success) {
      finalScore += 10;
    }

    finalScore = Math.min(finalScore, 100);

    const riskLevel = getRiskLevel(finalScore);

    const incompleteChecks = [];
    if (!redirectAnalysis.success) {
      incompleteChecks.push("Redirect Analysis");
    }

    if (!domainAnalysis.success) {
      incompleteChecks.push("Domain reputation");
    }

    if (!whoisAnalysis.success) {
      incompleteChecks.push("WHOIS/RDAP");
    }

    if (!urlhausAnalysis.success) {
      incompleteChecks.push("Malware database");
    }

    if (sslAnalysis.skipped) {
      incompleteChecks.push("SSL/HTTPS");
    }

    res.json({
      success: true,
      url: url,

      analysis: {
        ...validation,
        ...analysis,
      },

      redirectAnalysis,

      domainAnalysis,

      sslAnalysis,

      whoisAnalysis,

      urlhausAnalysis,

      riskLevel: {
        score: finalScore,
        level: riskLevel,
        incomplete: incompleteChecks.length > 0,
        incompleteChecks,
      },
    });
  } catch (error) {
    console.error("Scanner Error:", error);

    res.status(500).json({
      success: false,
      message: "Scanner error",
    });
  }
});

module.exports = router;
