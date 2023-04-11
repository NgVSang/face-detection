import fs from 'fs'
import {__dirname} from '../config';

const deleteFiles = (files: any) => {
    files.map((file: any) => {
        const filePath = __dirname + "/src/public/images/" + file.filename;
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }
    });
    return;
};

const deleteImages = (images: any) => {
    images.map((image: any) => {
        const path = __dirname + "/public/userImages" + image
        if (fs.existsSync(path)) {
            fs.unlinkSync(path);
        }
    });
};

const deleteImage = (image: any) => {
    const path = __dirname + "/public/" + image
    if (fs.existsSync(path)) {
        fs.unlinkSync(path);
    }
};

export { 
    deleteFiles, 
    deleteImages,
    deleteImage
};
