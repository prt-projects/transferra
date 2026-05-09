const connectDB = require('./config/db'); // Make sure this matches your DB connection file path
const File = require('./models/file');
const fs = require('fs');

// Connect to the database first
connectDB();

async function deleteOldFiles() {
    // 1. Calculate the exact time it was 24 hours ago
    const pastDate = new Date(Date.now() - 24 * 60 * 60 * 1000);

    try {
        // 2. Find all files in MongoDB where the 'createdAt' timestamp is older ($lt = less than) 24 hours
        const files = await File.find({ createdAt: { $lt: pastDate } });

        if (files.length) {
            for (const file of files) {
                try {
                    // 3. Double Deletion Process
                    fs.unlinkSync(file.path);           // A. Delete physical file from the hard drive
                    await file.deleteOne();             // B. Delete document from MongoDB
                    console.log(`🗑️ Successfully deleted: ${file.filename}`);
                } catch (err) {
                    console.log(`❌ Error deleting file ${file.filename}:`, err);
                }
            }
            console.log('✅ All old files have been cleared.');
        } else {
            console.log('⏳ No files older than 24 hours found.');
        }
    } catch (err) {
        console.error('🔥 Fatal Error while fetching files:', err);
    }
    
    // 4. Kill the script process so it doesn't hang in the terminal
    process.exit();
}

deleteOldFiles();