const cloudinary = require("cloudinary").v2;
const multer = require("multer");

const {
  CLOUDINARY_CLOUD_NAME,
  CLOUDINARY_API_KEY,
  CLOUDINARY_API_SECRET,
} = require("../helpers");

cloudinary.config({
  cloud_name: CLOUDINARY_CLOUD_NAME,
  api_key: CLOUDINARY_API_KEY,
  api_secret: CLOUDINARY_API_SECRET,
});

const storage = multer.memoryStorage();
const upload = multer({ storage });

// async function imageUploadUtil(file) {
//   const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
//   const result = await cloudinary.uploader.upload(base64, {
//     resource_type: "auto",
//   });
//   return result;
// }

async function imageUploadUtil(file) {
  if (!file || !file.buffer) {
    console.error("Invalid file object:", file);
    throw new Error("Invalid file upload. File or buffer is missing.");
  }

  const base64 = `data:${file.mimetype};base64,${file.buffer.toString("base64")}`;
  const result = await cloudinary.uploader.upload(base64, {
    resource_type: "auto",
  });

  return result;
}

module.exports = { upload, imageUploadUtil };
