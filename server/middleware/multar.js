import multer from "multer";


const storage = multer.memoryStorage();

export const singleUpload = multer({
    storage
}).single("file");


// // Set up Multer for file uploads
// const storagemultiple = multer.memoryStorage();
// export const uploadmultiple = multer({ storagemultiple }).array("files");



const storagemultiple = multer.memoryStorage(); // Use memory storage for multiple files
export const uploadmultiple = multer({ storage: storagemultiple }).array('files', 4);