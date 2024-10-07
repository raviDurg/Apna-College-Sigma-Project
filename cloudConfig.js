const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Correctly configure Cloudinary using `process.env`
cloudinary.config({
  cloud_name: process.env.CLOUDNAME,   // Should be process.env
  api_key: process.env.CLOUD_API_KEY,  // Should be process.env
  api_secret: process.env.CLOUD_API_SECRET // Should be process.env
});

// Set up Cloudinary storage engine with allowed formats
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'wanderlust_DEV', // Folder name in Cloudinary
    allowed_formats: ['png', 'jpg', 'jpeg'], // Ensure correct key
  },
});

module.exports = {
  cloudinary,
  storage,
};



