import { v2 as cloudinary } from 'cloudinary';

import './cloudinaryConfig';

export async function cloudinaryUploadImage(
    filePath: string,
    username: string,
    folderId: number,
    fileName: string,
) {
    const public_id = `${username}-${folderId}-${fileName}`;

    const uploadResult = await cloudinary.uploader
        .upload(filePath, {
            public_id,
        })
        .catch((error) => {
            console.error(error);
            throw new Error("Couldn't upload file!");
        });

    return uploadResult;
}

export async function cloudinaryRenameImage(
    oldName: string,
    newName: string,
    username: string,
    folderId: number,
) {
    const oldNameFull = `${username}-${folderId}-${oldName}`;
    const newNameFull = `${username}-${folderId}-${newName}`;

    const renameResult = await cloudinary.uploader
        .rename(oldNameFull, newNameFull)
        .then((result) => result)
        .catch((error) => {
            console.error(error);
            throw new Error("Couldn't rename image!");
        });

    return renameResult;
}

export async function cloudinaryDeleteImage(
    name: string,
    username: string,
    folderId: number,
) {
    const publicId = `${username}-${folderId}-${name}`;

    const deletionResult = await cloudinary.uploader
        .destroy(publicId)
        .then((result) => result)
        .catch((error) => {
            console.error(error);
            throw new Error("Couldn't delete image!");
        });

    return deletionResult;
}

export async function cloudinaryDeleteMultipleImages(
    files: any,
    username: string,
    folderId: number,
) {
    
    for (const file of files) {
        const publicId = `${username}-${folderId}-${file.name}`;
        const deletionResult = await cloudinary.uploader
        .destroy(publicId)
        .then((result) => result)
        .catch((error) => {
            console.error(error);
            throw new Error("Couldn't delete image!");
        });
    }

    return true;
}
