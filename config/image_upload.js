let uuidv4 = require("uuid");
let multer = require("multer");

var DIR = "./storage/";
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, DIR);
  },
  filename: (req, file, cb) => {
    const fileName = file.originalname.toLowerCase().split(" ").join("-");
    cb(null, uuidv4.v4() + "-" + fileName);
  },
});
var upload = multer({
  storage: storage,
  fileFilter: (req, file, cb) => {
    if (
      file.mimetype == "image/png" ||
      file.mimetype == "image/jpg" ||
      file.mimetype == "image/jpeg" ||
      file.mimetype == "image/jfif" ||
      file.mimetype == "image/gif" ||
      file.mimetype == "image/webp" ||
      file.mimetype == "image/svg+xml" ||
      file.mimetype == "image/tiff" ||
      file.mimetype == "image/bmp"
    ) {
      cb(null, true);
    } else {
      cb(null, false);
      return cb(
        new Error(
          "Only .png, .jpg, .jpeg, .jfif, .gif, .webp, .svg+xml, .tiff, .bmp format allowed!"
        )
      );
    }
  },
});

module.exports = upload;
