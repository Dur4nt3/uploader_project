import { v2 as cloudinary } from 'cloudinary';

import './cloudinaryConfig';

export async function cloudinaryUploadImage(
    filePath: string,
    username: string,
    folderId: number,
    fileName: string,
) {
    const public_id = `${username}-${folderId}-${fileName}`;

    const uploadResult = await cloudinary.uploader.upload(filePath, {
        public_id,
    }).catch((error) => {
        console.error(error);
        throw new Error('Couldn\'t upload file!');
    });

    return uploadResult;
}

export async function cloudinaryRenameImage(oldName: string, newName: string, username: string, folderId: number) {
    const oldNameFull = `${username}-${folderId}-${oldName}`;
    const newNameFull = `${username}-${folderId}-${newName}`;

    const renameResult = await cloudinary.uploader.rename(oldNameFull, newNameFull).then(result => result).catch((error) => {
        console.log(error);
        throw new Error('Couldn\'t rename image');
    })

    return renameResult;
}