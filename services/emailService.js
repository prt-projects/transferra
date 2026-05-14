module.exports = async ({ from, to, subject, text, html }) => {
    try {
        const response = await fetch('https://api.brevo.com/v3/smtp/email', {
            method: 'POST',
            headers: {
                'accept': 'application/json',
                'api-key': process.env.BREVO_API_KEY, 
                'content-type': 'application/json'
            },
            body: JSON.stringify({
                sender: { email: process.env.MAIL_USER, name: 'Transferra' }, 
                replyTo: { email: from },
                to: [{ email: to }],
                subject: subject,
                htmlContent: html
            })
        });

        if (!response.ok) {
            const errorData = await response.json();
            console.error("🔥 Brevo API Error:", errorData);
            throw new Error("API Email Send Failed");
        }

        console.log("✅ Email successfully handed off to Brevo API!");

    } catch (err) {
        console.error("❌ Fatal Error in emailService:", err);
        throw err;
    }
};