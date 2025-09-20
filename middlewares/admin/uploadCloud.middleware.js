const cloudinary = require("cloudinary").v2;
const streamifier = require("streamifier");

cloudinary.config({
  cloud_name: process.env.NAME,
  api_key: process.env.KEY,
  api_secret: process.env.SECRET,
});

// cloudinary.config({
//   cloud_name: "dcihvhlne",
//   api_key: "476732632746216",
//   api_secret: "Jo5sbXsJcR2csJW4GKbFcmpZqlM",
// });

module.exports.upload = (req, res, next) => {
  if (req.file) {
    let streamUpload = (req) => {
      return new Promise((resolve, reject) => {
        let stream = cloudinary.uploader.upload_stream((error, result) => {
          if (result) {
            resolve(result);
          } else {
            reject(error);
          }
        });
        streamifier.createReadStream(req.file.buffer).pipe(stream);
      });
    };

    async function upload(req) {
      let result = await streamUpload(req);
      req.body[req.file.fieldname] = result.secure_url;
      next();
    }
    upload(req);
  } else {
    next();
  }
};
