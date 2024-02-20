import multer from "multer";

// Define storage configuration for multer
const storage = multer.diskStorage({
    // Set destination directory for storing uploaded files
    destination: function (req, file, cb) {
        cb(null, "./public/temp");
    },
    // Set filename for uploaded files
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});

// Create multer upload middleware with defined storage configuration
export const upload = multer({ 
    storage, 
});
