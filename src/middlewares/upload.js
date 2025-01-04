import multer from "multer";
import { TEMP_UPLOAD_DIR } from "../constants/constants.js";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, TEMP_UPLOAD_DIR);
  },
  filename: function (req, file, cb) {
    const uniquePrefix = Date.now() + "-" + Math.round(Math.random() * 1e9);

    cb(null, `${uniquePrefix}_${file.originalname}`);
  },
});

const upload = multer({ storage });

export { upload };
