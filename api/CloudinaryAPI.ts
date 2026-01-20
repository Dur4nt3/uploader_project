import '../cloudinary/cloudinaryConfig';

import ImageAPI from './ImageAPI';

import { v2 as cloudinary } from 'cloudinary';

import type {
    cloudinaryFetchData,
    cloudinaryUploadData,
    cloudinaryRemoveData,
    cloudinaryRemoveMultipleData,
    cloudinaryEditData,
} from '../types/cloudinaryRequiredData';

export default class CloudinaryAPI extends ImageAPI {
    async fetch(fetchData: cloudinaryFetchData) {
        const { username, folderId, fileName } = fetchData;

        const publicId = `${username}-${folderId}-${fileName}`;
    }

    async upload(uploadData: cloudinaryUploadData) {
        const { filePath, username, folderId, fileName, authenticated } =
            uploadData;

        const public_id = `${username}-${folderId}-${fileName}`;

        console.log(authenticated);

        const uploadResult = await cloudinary.uploader
            .upload(filePath, {
                public_id,
                type: authenticated === true ? 'authenticated' : 'upload',
            })
            .catch((error) => {
                console.error(error);
                throw new Error("Couldn't upload file!");
            });

        return uploadResult;
    }

    async edit(editData: cloudinaryEditData) {
        const {
            username,
            folderId,
            oldName,
            newName,
            currentType,
            updatedType,
        } = editData;

        const oldNameFull = `${username}-${folderId}-${oldName}`;
        const newNameFull = `${username}-${folderId}-${newName}`;

        const editResult = await cloudinary.uploader
            .rename(oldNameFull, newNameFull, {
                type: currentType,
                to_type: updatedType,
                invalidate: true,
            })
            .then((result) => result)
            .catch((error) => {
                console.error(error);
                throw new Error("Couldn't edit image!");
            });

        return editResult;
    }

    async remove(removeData: cloudinaryRemoveData) {
        const { username, folderId, fileName } = removeData;

        const publicId = `${username}-${folderId}-${fileName}`;

        const deletionResult = await cloudinary.uploader
            .destroy(publicId)
            .then((result) => {
                if (result.result === 'not found') {
                    throw new Error('Image not found!');
                }
            })
            .catch((error) => {
                console.error(error);
                throw new Error("Couldn't delete image!");
            });

        return deletionResult;
    }

    async removeMultiple(removeMultipleData: cloudinaryRemoveMultipleData) {
        const { username, folderId, files } = removeMultipleData;

        for (const file of files) {
            const publicId = `${username}-${folderId}-${file.name}`;
            const deletionResult = await cloudinary.uploader
                .destroy(publicId)
                .then((result) => {
                    if (result.result === 'not found') {
                        throw new Error('Image not found!');
                    }
                })
                .catch((error) => {
                    console.error(error);
                    throw new Error("Couldn't delete image!");
                });
        }

        return true;
    }
}
