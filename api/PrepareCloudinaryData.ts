import PrepareImageAPIData from './PrepareImageAPIData';

import type {
    apiFetchData,
    apiUploadData,
    apiEditData,
    apiRemoveData,
    apiRemoveMultipleData,
} from '../types/apiRequiredData';

import type {
    cloudinaryFetchData,
    cloudinaryUploadData,
    cloudinaryRemoveData,
    cloudinaryRemoveMultipleData,
    cloudinaryEditData,
} from '../types/cloudinaryRequiredData';

export default class PrepareCloudinaryData extends PrepareImageAPIData {
    prepareFetchData(fetchData: apiFetchData): cloudinaryFetchData {
        return {
            username: fetchData.username,
            folderId: fetchData.folderId,
            fileName: fetchData.fileName,
            uploadType:
                fetchData.fileVisibility === 'private'
                    ? 'authenticated'
                    : 'upload',
        };
    }

    prepareUploadData(uploadData: apiUploadData): cloudinaryUploadData {
        return {
            filePath: uploadData.filePath,
            username: uploadData.username,
            folderId: uploadData.folderId,
            fileName: uploadData.fileName,
            authenticated: uploadData.fileVisibility === 'private',
        };
    }

    prepareEditData(editData: apiEditData): cloudinaryEditData {
        return {
            username: editData.username,
            folderId: editData.folderId,
            oldName: editData.oldName,
            newName: editData.newName,
            currentType:
                editData.currentFileVisibility === 'private'
                    ? 'authenticated'
                    : 'upload',
            updatedType:
                editData.updatedFileVisibility === 'private'
                    ? 'authenticated'
                    : 'upload',
        };
    }

    prepareRemoveData(removeData: apiRemoveData): cloudinaryRemoveData {
        return {
            username: removeData.username,
            folderId: removeData.folderId,
            fileName: removeData.fileName,
            uploadType:
                removeData.fileVisibility === 'private'
                    ? 'authenticated'
                    : 'upload',
        };
    }

    prepareRemoveMultipleData(
        removeMultipleData: apiRemoveMultipleData,
    ): cloudinaryRemoveMultipleData {
        const filesWithUploadType = [];
        for (const file of removeMultipleData.files) {
            const fileWithUploadType = { ...file };
            fileWithUploadType.uploadType =
                file.visibility.name === 'private' ? 'authenticated' : 'upload';

            filesWithUploadType.push(fileWithUploadType);
        }

        return {
            username: removeMultipleData.username,
            folderId: removeMultipleData.folderId,
            files: filesWithUploadType,
        };
    }
}
