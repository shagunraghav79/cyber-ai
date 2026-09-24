const tls = require("tls");

async function scanSSL(hostname) {
    return new Promise((resolve) => {

        const socket = tls.connect(
            {
                host: hostname,
                port: 443,
                servername: hostname,
                rejectUnauthorized: false
            },
            () => {

                const certificate = socket.getPeerCertificate();

                const authorized = socket.authorized;

                socket.end();

                resolve({
                    success: true,
                    authorized,
                    subject: certificate.subject,
                    issuer: certificate.issuer,
                    validFrom: certificate.valid_from,
                    validTo: certificate.valid_to
                });
            }
        );

        socket.setTimeout(5000);

        socket.on("timeout", () => {
            socket.destroy();

            resolve({
                success: false,
                message: "SSL connection timed out"
            });
        });

        socket.on("error", (error) => {
            socket.destroy();

            resolve({
                success: false,
                message: error.message
            });
        });
    });
}

module.exports = scanSSL;