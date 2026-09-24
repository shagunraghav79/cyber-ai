const dns = require("dns").promises;

async function scanDomain(hostname) {
    try {
        const result = await dns.lookup(hostname);

        return {
            success: true,
            hostname,
            ip: result.address,
            family: result.family
        };
    } catch (error) {
        return {
            success: false,
            hostname,
            message: "DNS lookup failed"
        };
    }
}

module.exports = scanDomain;