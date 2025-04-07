require("dotenv").config();
const cloudinary = require("cloudinary").v2;
const { CloudinaryStorage } = require("multer-storage-cloudinary");

// Setting Up Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET,
});

// Creating a Cloudinary Storage
const storage = new CloudinaryStorage({
  cloudinary,
  params: async (req, file) => {
    return {
      folder: "books",
      public_id: `${Date.now()}-${file.originalname.split(".")[0]}`,
      allowed_formats: ["jpg", "png", "jpeg"],
      transformation: [{ width: 500, height: 700, crop: "limit" }],
    };
  },
});

module.exports = { cloudinary, storage };
