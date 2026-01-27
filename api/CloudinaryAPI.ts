import '../cloudinary/cloudinaryConfig';

import ImageAPI from './ImageAPI';
import PrepareCloudinaryData from './PrepareCloudinaryData';
import ImageId from './ImageId';

import { v2 as cloudinary } from 'cloudinary';

import type {
    apiFetchData,
    apiUploadData,
    apiEditData,
    apiRemoveData,
    apiRemoveMultipleData,
} from '../types/apiRequiredData';

export default class CloudinaryAPI extends ImageAPI {
    constructor() {
        super(new PrepareCloudinaryData());
    }

    async fetch(fetchData: apiFetchData) {
        const cloudinaryData = this.dataConverter.prepareFetchData(fetchData);
        const { username, folderId, fileName, uploadType } = cloudinaryData;

        const publicId = ImageId.createId(username, folderId, fileName);

        let imageUrl;

        try {
            imageUrl = cloudinary.url(publicId, {
                type: uploadType,
                sign_url: true,
                fetch_format: 'auto',
                quality: 'auto',
            });
        } catch (error) {
            console.error(error);
            throw new Error("Couldn't create image url!");
        }

        return imageUrl;
    }

    async upload(uploadData: apiUploadData) {
        const cloudinaryData = this.dataConverter.prepareUploadData(uploadData);
        const { filePath, username, folderId, fileName, authenticated } =
            cloudinaryData;

        const publicId = ImageId.createId(username, folderId, fileName);

        const uploadResult = await cloudinary.uploader
            .upload(filePath, {
                public_id: publicId,
                type: authenticated === true ? 'authenticated' : 'upload',
            })
            .catch((error) => {
                console.error(error);
                throw new Error("Couldn't upload file!");
            });

        return uploadResult;
    }

    async edit(editData: apiEditData) {
        const cloudinaryData = this.dataConverter.prepareEditData(editData);

        const {
            username,
            folderId,
            oldName,
            newName,
            currentType,
            updatedType,
        } = cloudinaryData;

        const oldNameFull = ImageId.createId(username, folderId, oldName);
        const newNameFull = ImageId.createId(username, folderId, newName);

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

    async remove(removeData: apiRemoveData) {
        const cloudinaryData = this.dataConverter.prepareRemoveData(removeData);
        const { username, folderId, fileName, uploadType } = cloudinaryData;

        const publicId = ImageId.createId(username, folderId, fileName);

        const deletionResult = await cloudinary.uploader
            .destroy(publicId, { type: uploadType, invalidate: true })
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

    async removeMultiple(removeMultipleData: apiRemoveMultipleData) {
        const cloudinaryData =
            this.dataConverter.prepareRemoveMultipleData(removeMultipleData);
        const { username, folderId, files } = cloudinaryData;

        for (const file of files) {
            const publicId = ImageId.createId(username, folderId, file.name);

            const deletionResult = await cloudinary.uploader
                .destroy(publicId, { type: file.uploadType, invalidate: true })
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
