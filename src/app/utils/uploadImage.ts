import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
  destination: function (_req, _file, cb) {
    cb(null, path.join(process.cwd(), "/uploads"));
  },
  filename: function (_req, file, cb) {
    cb(null, file.originalname);
  },
});

const uploadImage = multer({ storage: storage });

export default uploadImage;
