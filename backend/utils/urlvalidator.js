function validateURL(url) {
    try {
        const parsedURL = new URL(url);

        if (
            parsedURL.protocol !== "http:" &&
            parsedURL.protocol !== "https:"
        ) {
            return {
                valid: false,
                reason: "Only HTTP and HTTPS URLs are allowed"
            };
        }

        return {
            valid: true,
            protocol: parsedURL.protocol,
            hostname: parsedURL.hostname,
            pathname: parsedURL.pathname
        };

    } catch (error) {
        return {
            valid: false,
            reason: "Invalid URL"
        };
    }
}

module.exports = validateURL;