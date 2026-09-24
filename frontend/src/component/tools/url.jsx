import React, { useState } from "react";
import {
  FaLink,
  FaShieldAlt,
  FaGlobe,
  FaRoute,
  FaLock,
  FaUser,
  FaSearch,
  FaExclamationTriangle,
  FaCheckCircle,
  FaClock,
  FaBug,
  FaExternalLinkAlt,
} from "react-icons/fa";

import "./url.css";

function Url() {
  const [url, setUrl] = useState("");
  const [activeTab, setActiveTab] = useState("overview");

  const [scanning, setScanning] = useState(false);
  const [scanned, setScanned] = useState(false);

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");

  const tabs = [
    {
      id: "overview",
      label: "Overview",
      icon: <FaShieldAlt />,
    },
    {
      id: "domain",
      label: "Domain",
      icon: <FaGlobe />,
    },
    {
      id: "redirect",
      label: "Redirect",
      icon: <FaRoute />,
    },
    {
      id: "ssl",
      label: "SSL",
      icon: <FaLock />,
    },
    {
      id: "url",
      label: "URL",
      icon: <FaLink />,
    },
    {
      id: "whois",
      label: "Whois",
      icon: <FaUser />,
    },
  ];

  const handleScan = async () => {
    if (!url.trim()) return;

    setScanning(true);
    setScanned(false);
    setError("");
    setResult(null);

    try {
      const response = await fetch("http://localhost:5000/api/url/scan", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          url: url.trim(),
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "URL scanning failed");
      }

      console.log("URL Scanner Result:", data);

      setResult(data);
      setScanned(true);
      setActiveTab("overview");
    } catch (error) {
      console.error("URL Scanner Error:", error);

      setError(error.message || "Unable to connect to URL Scanner backend.");
    } finally {
      setScanning(false);
    }
  };
  const renderOverview = () => {
    if (scanning) {
      return (
        <div className="scan-state">
          <div className="scan-animation">
            <FaSearch />
          </div>

          <h2>Scanning URL...</h2>

          <p>
            CyberAi is analyzing the URL across multiple security indicators.
          </p>

          <div className="scan-progress">
            <span></span>
          </div>

          <div className="scan-stage">
            <span>
              <FaClock /> Running security analysis
            </span>
          </div>
        </div>
      );
    }

    if (!scanned) {
      return (
        <div className="scan-state">
          <div className="scan-icon">
            <FaShieldAlt />
          </div>

          <h2>Ready to Scan</h2>

          <p>
            Enter a URL above and click the Scan button to check for potential
            security threats.
          </p>
        </div>
      );
    }

    return (
      <div className="scan-result-overview">
        <div className="result-icon safe">
          <FaCheckCircle />
        </div>

        <h2>
          {result?.riskLevel?.incomplete
            ? "Scan Incomplete"
            : "Analysis Complete"}
        </h2>

        <p>
          {result?.riskLevel?.incomplete
            ? "Some security checks were unavailable. Do not assume this URL is safe."
            : "The URL has been analyzed by CyberAi security services."}
        </p>

        <div className="result-url">
          <FaLink />
          <span>{url}</span>
          <FaExternalLinkAlt />
        </div>
        <div className="overview-grid">
          <div className="overview-item">
            <span>Domain</span>

            <strong
              className={
                result?.domainAnalysis?.success ? "safe-text" : "danger-text"
              }
            >
              {result
                ? result.domainAnalysis?.success
                  ? "Valid"
                  : "Problem"
                : "--"}
            </strong>
          </div>

          <div className="overview-item">
            <span>SSL</span>

            <strong
              className={
                result?.sslAnalysis?.authorized ? "safe-text" : "danger-text"
              }
            >
              {result
                ? result.sslAnalysis?.skipped
                  ? "Skipped"
                  : result.sslAnalysis?.authorized
                    ? "Valid"
                    : "Invalid"
                : "--"}
            </strong>
          </div>

          <div className="overview-item">
            <span>Redirects</span>

            <strong
              className={
                result && result.redirectAnalysis?.redirectCount <= 3
                  ? "safe-text"
                  : "danger-text"
              }
            >
              {result ? `${result.redirectAnalysis?.redirectCount ?? 0}` : "--"}
            </strong>
          </div>

          <div className="overview-item">
            <span>Threats</span>

            <strong
              className={
                result?.urlhausAnalysis?.found ? "danger-text" : "safe-text"
              }
            >
              {result
                ? result.urlhausAnalysis?.found
                  ? "Detected"
                  : "None"
                : "--"}
            </strong>
          </div>
        </div>
      </div>
    );
  };

  const renderTabContent = () => {
    if (!scanned) {
      return renderOverview();
    }

    switch (activeTab) {
      case "domain":
        return (
          <div className="detail-content">
            <div className="detail-title">
              <FaGlobe />
              <div>
                <h2>Domain Analysis</h2>
                <p>Information collected by the domain scanner.</p>
              </div>
            </div>

            <div className="detail-grid">
              <div>
                <span>Domain</span>
                <strong>{result?.analysis?.hostname || "Not available"}</strong>
              </div>

              <div>
                <span>Domain Status</span>
                <strong
                  className={
                    result?.domainAnalysis?.success
                      ? "safe-text"
                      : "danger-text"
                  }
                >
                  {result?.domainAnalysis?.success ? "Valid" : "Problem"}
                </strong>
              </div>

              <div>
                <span>IP Address</span>
                <strong>{result?.domainAnalysis?.ip || "Not available"}</strong>
              </div>

              <div>
                <span>IP Version</span>
                <strong>
                  {result?.domainAnalysis?.family
                    ? `IPv${result.domainAnalysis.family}`
                    : "Not available"}
                </strong>
              </div>
            </div>
          </div>
        );
      case "redirect":
        return (
          <div className="detail-content">
            <div className="detail-title">
              <FaRoute />
              <div>
                <h2>Redirect Analysis</h2>
                <p>Checking the URL redirect chain.</p>
              </div>
            </div>

            <div className="redirect-result">
              {result?.redirectAnalysis?.success ? (
                result.redirectAnalysis.redirectCount <= 3 ? (
                  <FaCheckCircle />
                ) : (
                  <FaExclamationTriangle />
                )
              ) : (
                <FaExclamationTriangle />
              )}

              <div>
                <strong>
                  {!result?.redirectAnalysis?.success
                    ? "Redirect Analysis Unavailable"
                    : result.redirectAnalysis.redirectCount <= 3
                      ? "No Suspicious Redirects"
                      : "Multiple Redirects Detected"}
                </strong>

                <p>
                  {!result?.redirectAnalysis?.success
                    ? "Redirect information could not be retrieved."
                    : `${result.redirectAnalysis.redirectCount} redirect(s) detected.`}
                </p>
              </div>
            </div>

            <div className="redirect-chain">
              <div className="chain-item">
                <span>1</span>
                <p>{result?.redirectAnalysis?.originalUrl || url}</p>
              </div>

              {result?.redirectAnalysis?.success &&
                result.redirectAnalysis?.redirects?.map((redirect, index) => (
                  <div className="chain-item" key={index}>
                    <span>{index + 2}</span>
                    <p>{redirect.url || redirect.location || redirect}</p>
                  </div>
                ))}

              {result?.redirectAnalysis?.success &&
                result?.redirectAnalysis?.finalUrl &&
                result.redirectAnalysis.finalUrl !==
                  result.redirectAnalysis.originalUrl && (
                  <div className="chain-item">
                    <span>
                      {(result.redirectAnalysis.redirectCount || 0) + 1}
                    </span>
                    <p>{result.redirectAnalysis.finalUrl}</p>
                  </div>
                )}
            </div>
          </div>
        );

      case "ssl":
        const ssl = result?.sslAnalysis;

        return (
          <div className="detail-content">
            <div className="detail-title">
              <FaLock />
              <div>
                <h2>SSL / HTTPS Analysis</h2>
                <p>Security certificate and HTTPS information.</p>
              </div>
            </div>

            {ssl?.skipped ? (
              <div className="ssl-status">
                <FaExclamationTriangle />
                <div>
                  <strong>SSL Check Skipped</strong>
                  <p>{ssl.message}</p>
                </div>
              </div>
            ) : (
              <div className="ssl-status">
                {ssl?.authorized ? (
                  <FaCheckCircle />
                ) : (
                  <FaExclamationTriangle />
                )}

                <div>
                  <strong>
                    {ssl?.authorized
                      ? "Secure Connection"
                      : "SSL Certificate Problem"}
                  </strong>

                  <p>
                    {ssl?.authorized
                      ? "The SSL certificate was successfully verified."
                      : "The SSL certificate could not be verified."}
                  </p>
                </div>
              </div>
            )}

            <div className="detail-grid">
              <div>
                <span>Protocol</span>
                <strong>
                  {result?.analysis?.protocol === "https:" ? "HTTPS" : "HTTP"}
                </strong>
              </div>

              <div>
                <span>Certificate</span>
                <strong
                  className={
                    ssl?.skipped
                      ? "warning-text"
                      : ssl?.authorized
                        ? "safe-text"
                        : "danger-text"
                  }
                >
                  {ssl?.skipped
                    ? "Skipped"
                    : ssl?.authorized
                      ? "Valid"
                      : "Invalid"}
                </strong>
              </div>

              <div>
                <span>Subject</span>
                <strong>
                  {ssl?.subject?.CN ||
                    ssl?.subject?.commonName ||
                    "Not available"}
                </strong>
              </div>

              <div>
                <span>Issuer</span>
                <strong>
                  {ssl?.issuer?.O ||
                    ssl?.issuer?.organization ||
                    "Not available"}
                </strong>
              </div>
            </div>
          </div>
        );

      case "url":
        const analysis = result?.analysis;

        return (
          <div className="detail-content">
            <div className="detail-title">
              <FaLink />
              <div>
                <h2>URL Analysis</h2>
                <p>Structural analysis of the submitted URL.</p>
              </div>
            </div>

            <div className="url-analysis-box">
              <span>Submitted URL</span>
              <p>{result?.url || url}</p>
            </div>

            <div className="detail-grid">
              <div>
                <span>URL Structure</span>
                <strong
                  className={analysis?.valid ? "safe-text" : "danger-text"}
                >
                  {analysis?.valid ? "Valid" : "Invalid"}
                </strong>
              </div>

              <div>
                <span>Protocol</span>
                <strong>{analysis?.protocol || "Not available"}</strong>
              </div>

              <div>
                <span>Hostname</span>
                <strong>{analysis?.hostname || "Not available"}</strong>
              </div>

              <div>
                <span>Risk Score</span>
                <strong
                  className={
                    (analysis?.score ?? 0) > 30 ? "danger-text" : "safe-text"
                  }
                >
                  {analysis?.score ?? 0}/100
                </strong>
              </div>
            </div>
          </div>
        );

      case "whois":
        return (
          <div className="detail-content">
            <div className="detail-title">
              <FaUser />
              <div>
                <h2>WHOIS Information</h2>
                <p>Domain registration information.</p>
              </div>
            </div>

            <div className="detail-grid whois-grid">
              <div>
                <span>Domain</span>
                <strong>{url}</strong>
              </div>

              <div>
                <span>Registrar</span>
                <strong>
                  {result?.whoisAnalysis?.registrar || "Not available"}
                </strong>
              </div>

              <div>
                <span>Registration</span>
                <strong>
                  {result?.whoisAnalysis?.createdDate || "Not available"}
                </strong>
              </div>

              <div>
                <span>Expiration</span>
                <strong>
                  {" "}
                  {result?.whoisAnalysis?.expirationDate || "Not available"}
                </strong>
              </div>
            </div>
          </div>
        );

      default:
        return renderOverview();
    }
  };

  return (
    <div className="url-page">
      {/* PAGE HEADER */}

      <div className="url-header">
        <div className="url-header-icon">
          <FaLink />
        </div>

        <div>
          <h1>URL SCANNER</h1>

          <p>
            Analyze a URL for malicious activity, phishing attempts, suspicious
            redirects and other security threats.
          </p>
        </div>
      </div>

      {/* URL INPUT */}

      <div className="scanner-card">
        <label htmlFor="url-input">Enter URL</label>

        <div className="url-input-area">
          <div className="url-input-wrapper">
            <FaLink />

            <input
              id="url-input"
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleScan();
                }
              }}
            />
          </div>

          <button
            className="scan-button"
            onClick={handleScan}
            disabled={scanning || !url.trim()}
          >
            <FaShieldAlt />

            {scanning ? "Scanning..." : "Scan URL"}
          </button>
        </div>

        <p className="input-hint">
          <FaSearch />
          Example: https://google.com or https://example.com
        </p>
      </div>
      {error && (
        <div className="scanner-error">
          <FaExclamationTriangle />
          <span>{error}</span>
        </div>
      )}
      {/* MAIN ANALYSIS AREA */}

      <div className="analysis-layout">
        {/* LEFT */}

        <div className="analysis-main">
          {/* TABS */}

          <div className="scanner-tabs">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                className={
                  activeTab === tab.id ? "scanner-tab active" : "scanner-tab"
                }
                onClick={() => setActiveTab(tab.id)}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* TAB CONTENT */}

          <div className="tab-content">{renderTabContent()}</div>
        </div>

        {/* RIGHT */}

        <div className="analysis-sidebar">
          {/* RISK SCORE */}

          <div className="risk-card">
            <h2>Risk Score</h2>

            <div className="risk-content">
              <div
                className={`risk-circle ${
                  result?.riskLevel?.incomplete
                    ? "warning"
                    : result?.riskLevel?.level
                      ? result.riskLevel.level.toLowerCase()
                      : ""
                }`}
              >
                <div>
                  <strong>{result?.riskLevel?.score ?? "--"}</strong>
                  <span>/100</span>
                </div>
              </div>

              <div className="risk-info">
                {scanned ? (
                  <>
                    <h3
                      className={
                        result?.riskLevel?.incomplete
                          ? "warning-text"
                          : result?.riskLevel?.level === "LOW"
                            ? "safe-text"
                            : result?.riskLevel?.level === "MEDIUM"
                              ? "warning-text"
                              : "danger-text"
                      }
                    >
                      {result?.riskLevel?.incomplete ? (
                        <FaExclamationTriangle />
                      ) : result?.riskLevel?.level === "LOW" ? (
                        <FaCheckCircle />
                      ) : (
                        <FaExclamationTriangle />
                      )}

                      {result?.riskLevel?.incomplete
                        ? "SCAN INCOMPLETE"
                        : result?.riskLevel?.level || "Unknown"}
                    </h3>

                    <p
                      className={
                        result?.riskLevel?.incomplete ? "warning-text" : ""
                      }
                    >
                      {result?.riskLevel?.incomplete
                        ? "Some security checks were unavailable. Do not assume this URL is safe."
                        : result
                          ? `Security score: ${result.riskLevel.score}/100`
                          : "Results will appear here after scanning."}
                    </p>
                  </>
                ) : (
                  <>
                    <h3>
                      <FaShieldAlt />
                      No Scan Yet
                    </h3>

                    <p>Results will appear here after scanning.</p>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* SECURITY CHECKS */}

          <div className="checks-card">
            <h2>
              <FaShieldAlt />
              Security Checks
            </h2>

            <SecurityCheck
              icon={<FaGlobe />}
              title="Domain Reputation"
              status={
                result
                  ? result.domainAnalysis?.success
                    ? "Safe"
                    : "Problem"
                  : "Pending"
              }
            />

            <SecurityCheck
              icon={<FaLock />}
              title="SSL / HTTPS"
              status={
                result
                  ? result.sslAnalysis?.skipped
                    ? "Skipped"
                    : result.sslAnalysis?.authorized
                      ? "Safe"
                      : "Invalid"
                  : "Pending"
              }
            />

            <SecurityCheck
              icon={<FaRoute />}
              title="Redirect Analysis"
              status={
                result
                  ? result.redirectAnalysis?.redirectCount <= 3
                    ? "Safe"
                    : "Warning"
                  : "Pending"
              }
            />

            <SecurityCheck
              icon={<FaExclamationTriangle />}
              title="URL Risk Indicators"
              status={
                result
                  ? result.analysis?.score <= 30
                    ? "Safe"
                    : "Warning"
                  : "Pending"
              }
            />

            <SecurityCheck
              icon={<FaBug />}
              title="Malware Detection"
              status={
                result
                  ? result.urlhausAnalysis?.found
                    ? "Detected"
                    : "Safe"
                  : "Pending"
              }
            />
          </div>

          {/* DISCLAIMER */}

          <div className="url-disclaimer">
            <FaExclamationTriangle />

            <p>
              CyberAi provides automated security analysis. Results should not
              be considered a guarantee that a URL is completely safe.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* SECURITY CHECK COMPONENT */

function SecurityCheck({ icon, title, status }) {
  const isSafe = status === "Safe";

  const isDanger =
    status === "Problem" || status === "Invalid" || status === "Detected";

  const isWarning =
    status === "Warning" || status === "Skipped" || status === "Not Available";

  return (
    <div className="security-check">
      <div className="check-icon">{icon}</div>

      <span>{title}</span>

      <strong
        className={
          isSafe
            ? "check-safe"
            : isDanger
              ? "check-danger"
              : isWarning
                ? "check-warning"
                : "check-pending"
        }
      >
        {isSafe ? (
          <FaCheckCircle />
        ) : isDanger ? (
          <FaExclamationTriangle />
        ) : isWarning ? (
          <FaExclamationTriangle />
        ) : (
          <FaClock />
        )}

        {status}
      </strong>
    </div>
  );
}

export default Url;
