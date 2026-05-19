module.exports = async ({ from, to, subject, text, html }) => {
    const url = 'https://api.brevo.com/v3/smtp/email';
    
    const payload = {
        sender: { email: process.env.MAIL_USER, name: "Transferra" },
        replyTo: { email: from },
        to: [{ email: to }],
        subject: subject,
        textContent: text,
        htmlContent: html
    };

    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'accept': 'application/json',
            'api-key': process.env.BREVO_API_KEY,
            'content-type': 'application/json'
        },
        body: JSON.stringify(payload)
    });

    if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Brevo API Error: ${JSON.stringify(errorData)}`);
    }
};