const axios = require("axios");

async function scanRedirects(url) {
    try {
        const redirects = [];

        const response = await axios.get(url, {
            maxRedirects: 10,
            timeout: 5000,
            validateStatus: () => true,
            beforeRedirect: (options, responseDetails) => {
                redirects.push({
                    statusCode: responseDetails.statusCode,
                    location: responseDetails.headers.location
                });
            }
        });

        return {
            success: true,
            originalUrl: url,
            finalUrl: response.request.res.responseUrl || url,
            redirectCount: redirects.length,
            redirects
        };

    } catch (error) {
        return {
            success: false,
            message: error.message
        };
    }
}

module.exports = scanRedirects;