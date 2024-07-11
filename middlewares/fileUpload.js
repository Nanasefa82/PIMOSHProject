const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Ensure destination directories exist
const imageDir = path.join(__dirname, '../public/uploads/images');
const documentDir = path.join(__dirname, '../public/uploads/documents');
if (!fs.existsSync(imageDir)) {
    fs.mkdirSync(imageDir, { recursive: true });
}
if (!fs.existsSync(documentDir)) {
    fs.mkdirSync(documentDir, { recursive: true });
}

// Check file type
function checkFileType(file, cb, filetypes) {
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Incorrect file type!');
    }
}

// Common storage configuration
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        console.log('Destination function called for:', file.fieldname);
        if (file.fieldname === 'image' || file.fieldname === 'selfie' || (file.fieldname === 'stateId' && /jpeg|jpg|png/.test(file.mimetype))) {
            cb(null, imageDir);
        } else if (file.fieldname === 'coverLetter' || file.fieldname === 'resume' || (file.fieldname === 'stateId' && /pdf/.test(file.mimetype))) {
            cb(null, documentDir);
        }
    },
    filename: (req, file, cb) => {
        console.log('Filename function called for:', file.fieldname);
        let prefix = 'document-';
        if (file.fieldname === 'image' || file.fieldname === 'selfie' || (file.fieldname === 'stateId' && /jpeg|jpg|png/.test(file.mimetype))) {
            prefix = 'image-';
        }
        cb(null, prefix + Date.now() + path.extname(file.originalname));
    }
});

// Middleware to handle multiple file uploads
const upload = multer({
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 10 }, // 10 MB file size limit
    fileFilter: (req, file, cb) => {
        console.log('File filter called for:', file.fieldname);
        if (file.fieldname === 'image' || file.fieldname === 'selfie' || (file.fieldname === 'stateId' && /jpeg|jpg|png/.test(file.mimetype))) {
            checkFileType(file, cb, /jpeg|jpg|png/);
        } else if (file.fieldname === 'coverLetter' || file.fieldname === 'resume' || (file.fieldname === 'stateId' && /pdf/.test(file.mimetype))) {
            checkFileType(file, cb, /pdf|doc|docx/);
        } else {
            cb('Error: Unexpected field!');
        }
    }
}).fields([
    { name: 'image', maxCount: 1 },
    { name: 'selfie', maxCount: 1 },
    { name: 'coverLetter', maxCount: 1 },
    { name: 'resume', maxCount: 1 },
    { name: 'stateId', maxCount: 1 }
]);

module.exports = upload;
