const axios = require("axios");

async function scanURLhaus(url) {
    try {
        const response = await axios.post(
            "https://urlhaus-api.abuse.ch/v1/url/",
            new URLSearchParams({
                url: url
            }),
            {
                headers: {
                    "Auth-Key": process.env.URLHAUS_AUTH_KEY,
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                timeout: 10000
            }
        );

        const data = response.data;
        console.log("URLhaus Response:", data);

        return {
            success: true,
            url,
            found: data.query_status !== "no_results",
            status: data.query_status,
            data
        };

    } catch (error) {
        return {
            success: false,
            url,
            message: error.response?.data || error.message
        };
    }
}

module.exports = scanURLhaus;