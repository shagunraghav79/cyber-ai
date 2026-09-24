const axios = require("axios");

async function scanWhois(domain) {
    try {
        const response = await axios.get(
            `https://rdap.verisign.com/com/v1/domain/${encodeURIComponent(domain)}`,
            {
                timeout: 10000,
                headers: {
                    Accept: "application/rdap+json"
                }
            }
        );

        const data = response.data;
        const events = data.events || [];

        const createdEvent = events.find(
            (event) => event.eventAction === "registration"
        );

        const updatedEvent = events.find(
            (event) => event.eventAction === "last changed"
        );

        const expirationEvent = events.find(
            (event) => event.eventAction === "expiration"
        );

        let ageDays = null;

        if (createdEvent?.eventDate) {
            const created = new Date(createdEvent.eventDate);
            const now = new Date();

            ageDays = Math.floor(
                (now - created) / (1000 * 60 * 60 * 24)
            );
        }

        const registrarEntity = data.entities?.find(
            (entity) => entity.roles?.includes("registrar")
        );

        const registrarName =
            registrarEntity?.vcardArray?.[1]?.find(
                (item) => item[0] === "fn"
            )?.[3] || null;

        return {
            success: true,
            domain,

            createdDate: createdEvent?.eventDate || null,

            updatedDate: updatedEvent?.eventDate || null,

            expirationDate: expirationEvent?.eventDate || null,

            ageDays,

            registrar: registrarName
        };

    } catch (error) {
        console.error(
            "WHOIS/RDAP Error:",
            error.response?.data || error.message
        );

        return {
            success: false,
            domain,
            message:
                error.response?.data?.errorCode
                    ? `RDAP error: ${error.response.data.errorCode}`
                    : error.message
        };
    }
}

module.exports = scanWhois;