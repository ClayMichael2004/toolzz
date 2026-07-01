import multer from "multer";
import path from "path";
import fs from "fs";

const uploadDirectory = "src/uploads";

if (!fs.existsSync(uploadDirectory)) {
    fs.mkdirSync(uploadDirectory, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDirectory);
    },

    filename: (req, file, cb) => {
        const timestamp = Date.now();
        cb(null, `${timestamp}-${file.originalname}`);
    },
});

const fileFilter = (req, file, cb) => {
    const extension = path.extname(file.originalname).toLowerCase();

    if (extension !== ".zip") {
        return cb(new Error("Only ZIP files are allowed."));
    }

    cb(null, true);
};

const upload = multer({
    storage,
    fileFilter,
    limits: {
        fileSize: 100 * 1024 * 1024, // 100MB
    },
});

export default upload;