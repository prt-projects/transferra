module.exports = ({ emailFrom, downloadLink, size, expires }) => {
    return `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #eaeaea; border-radius: 10px;">
            <h2 style="color: #03a9f4; text-align: center;">Transferra</h2>
            <p style="font-size: 16px; color: #333;">Hi there,</p>
            <p style="font-size: 16px; color: #333;"><b>${emailFrom}</b> has securely shared a file with you via Transferra.</p>
            <p style="font-size: 14px; color: #666;">File Size: ${size} <br> Link Expires in: ${expires}</p>
            
            <div style="text-align: center; margin: 30px 0;">
                <a href="${downloadLink}" style="background-color: #03a9f4; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">Download File</a>
            </div>

            <div style="text-align: center; margin-top: 20px;">
                <p style="font-size: 14px; color: #666;">Or scan this QR code to download:</p>
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${downloadLink}" alt="QR Code" style="border: 1px solid #ccc; padding: 5px; border-radius: 5px;" />
            </div>
            
            <p style="font-size: 12px; color: #999; text-align: center; margin-top: 30px;">Thank you for using Transferra. This is an automated message.</p>
        </div>
    `;
};