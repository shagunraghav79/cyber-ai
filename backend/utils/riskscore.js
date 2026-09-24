function getRiskLevel(score) {
    if (score < 25) {
        return "LOW";
    }

    if (score < 50) {
        return "MEDIUM";
    }

    if (score < 75) {
        return "HIGH";
    }

    return "CRITICAL";
}

module.exports = getRiskLevel;