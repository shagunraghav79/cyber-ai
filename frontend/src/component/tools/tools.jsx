import React from "react";
import { Link } from "react-router-dom";
import "./tools.css";

function Tools() {
  return (
    <div className="tools">
      <div className="title">
        <h2 className="tools-title">Tools</h2>
      </div>

      <Link to="/url-scanner" className="url-scanner">
        <h2>URL Scanner</h2>
        <p>
          Check if a URL is safe or malicious by scanning it for potential
          threats.
        </p>
      </Link>

        <Link to="/email-checker" className="email-cheacker">
        <h2>Email Checker</h2>
        <p>
          Verify the validity of an email address and check if it is associated
          with any known spam or phishing activities.
        </p>
       </Link>

      <div className="ip-tracker">
        <h2>IP Tracker</h2>
        <p>
          Track the location and other details of an IP address to identify
          potential security risks.
        </p>
      </div>

      

      <div className="app-cheacker">
        <h2>App Checker</h2>
        <p>
          Check if an application is safe to download and use by scanning it
          for potential threats.
        </p>
      </div>
    </div>
  );
}

export default Tools;