const multer = require("multer");

module.exports = () => {
  const storage = multer.memoryStorage();
  return storage;
};
