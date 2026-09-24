function analyzeURL(url) {
    const parsed = new URL(url);

    const issues = [];
    let score = 0;

    // HTTP instead of HTTPS
    if (parsed.protocol === "http:") {
        issues.push("Website does not use HTTPS");
        score += 5;
    }

    // IP address instead of domain
    const ipPattern = /^(\d{1,3}\.){3}\d{1,3}$/;

    if (ipPattern.test(parsed.hostname)) {
        issues.push("URL uses an IP address instead of a domain");
        score += 20;
    }

    // Very long URL
    if (url.length > 200) {
        issues.push("URL is unusually long");
        score += 10;
    }

    // Suspicious words
    const suspiciousWords = [
        "login",
        "verify",
        "account",
        "password",
        "credential",
        "secure",
        "update"
    ];

    const lowerURL = url.toLowerCase();

    const foundWords = suspiciousWords.filter(word =>
        lowerURL.includes(word)
    );

    if (foundWords.length > 0) {
        issues.push(
            `Suspicious keywords detected: ${foundWords.join(", ")}`
        );
        score += Math.min(foundWords.length * 5, 20);
    }

    return {
        score,
        issues
    };
}

module.exports = analyzeURL;