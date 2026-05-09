const router = require('express').Router();
const multer = require('multer');
const path = require('path');
const File = require('../models/file');
const { v4: uuidv4 } = require('uuid');

let storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/') ,
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1E9)}${path.extname(file.originalname)}`;
              cb(null, uniqueName)
    } ,
});

let upload = multer({ storage, limits:{ fileSize: 1000000 * 100 }, }).single('myfile'); //100mb

router.post('/', (req, res) => {
    upload(req, res, async (err) => {
      if (err) {
        return res.status(500).send({ error: err.message });
      }
        const file = new File({
            filename: req.file.filename,
            uuid: uuidv4(),
            path: req.file.path,
            size: req.file.size
        });
        const response = await file.save();
        res.json({ file: `${process.env.APP_BASE_URL}/files/${response.uuid}` });
      });
});

router.post('/send', async (req, res) => {
    console.log("🚀 1. /send route was hit!");
    console.log("📦 2. Request body received:", req.body);

    const { uuid, emailTo, emailFrom } = req.body;

    if (!uuid || !emailTo || !emailFrom) {
        console.log("❌ 3. Failed: Missing fields in frontend request.");
        return res.status(422).send({ error: 'All fields are required.' });
    }

    try {
        console.log(`🔍 4. Searching database for UUID: ${uuid}`);
        const file = await File.findOne({ uuid: uuid });
        
        if (!file) {
             console.log("❌ 5. Failed: File not found in database.");
             return res.status(404).send({ error: 'File not found.' });
        }

        if (file.sender) {
            console.log("⚠️ 6. Failed: Email already sent for this file.");
            return res.status(422).send({ error: 'Email already sent.' });
        }

        console.log("💾 7. Saving sender/receiver to database...");
        file.sender = emailFrom;
        file.receiver = emailTo;
        await file.save();

        console.log("⚙️ 8. Loading email services...");
        const sendMail = require('../services/emailService');
        const emailTemplate = require('../services/emailTemplate');

        console.log("📧 9. Handing off to Brevo SMTP...");
        
        // Added 'await' here to force Express to wait for the email result
        await sendMail({
            from: emailFrom,
            to: emailTo,
            subject: 'Transferra - File Shared With You',
            text: `${emailFrom} shared a file with you.`,
            html: emailTemplate({
                emailFrom: emailFrom,
                downloadLink: `${process.env.APP_BASE_URL}/files/${file.uuid}`,
                size: parseInt(file.size / 1000) + ' KB',
                expires: '24 hours'
            })
        });

        console.log("✅ 10. Success! Email sent.");
        return res.send({ success: true });

    } catch (err) {
        console.error("🔥 FATAL ERROR CAUGHT:", err);
        return res.status(500).send({ error: 'Something went wrong while sending the email.' });
    }
});

module.exports = router;