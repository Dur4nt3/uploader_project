import type { Request, Response } from 'express';
import { matchedData, validationResult } from 'express-validator';

import multer from 'multer';

import removeAllUploads from './utilities/removeAllUploads';

import folderChecks from './utilities/folderChecks';
import {
    validateFile,
    validateFileEdit,
} from './utilities/validationUtilities';
import {
    getFieldErrorMsg,
    renderError500,
    renderError401,
} from './utilities/errorsUtilities';

import {
    getAllVisibilityOptions,
    getFolderByUserIdAndFolderId,
    isVisibilityPrivate,
} from '../db/queries/indexQueriesSelect';

import {
    isUserAllowedToCreateFile,
    getFileByFolderIdAndFileId,
} from '../db/queries/folderQueriesSelect';
import { createFile } from '../db/queries/folderQueriesInsert';
import { updateFile } from '../db/queries/folderQueriesUpdate';
import { deleteFile } from '../db/queries/folderQueriesDelete';

import type {
    cloudinaryUploadData,
    cloudinaryEditData,
    cloudinaryRemoveData,
} from '../types/cloudinaryRequiredData';

import CloudinaryAPI from '../api/CloudinaryAPI';

const imageAPIProvider = new CloudinaryAPI();

const multerStorage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, callback) => {
        callback(
            null,
            Math.round(Math.random() * 1e6) + '-' + file.originalname,
        );
    },
});

const upload = multer({ storage: multerStorage });

const controllerPostCreateFile: any = [
    upload.single('image'),
    validateFile,
    async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            await removeAllUploads();
            return renderError401(res);
        }

        const checkResults = await folderChecks(req);

        if (checkResults !== null) {
            await removeAllUploads();
            return checkResults(res);
        }

        let options;

        const creationAuthorized = await isUserAllowedToCreateFile(
            req.user.userId,
        );

        if (!creationAuthorized) {
            options = await getAllVisibilityOptions();

            await removeAllUploads();
            return res.status(400).render('root/create-folder', {
                errors: [{ msg: "You've reached the file limit" }],
                options,
            });
        }

        const folder = await getFolderByUserIdAndFolderId(
            req.user.userId,
            Number(req.params.folderId),
        );

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorsArray = errors.array();

            const visibilityErrors = getFieldErrorMsg(
                errorsArray,
                'visibility',
            );

            if (visibilityErrors.length !== 0) {
                return renderError500(res);
            }

            options = await getAllVisibilityOptions();

            await removeAllUploads();
            return res.status(400).render('folder/create-file', {
                options,
                folder,
                errors: [{ msg: 'Please fix the errors below' }],
                name: req.body.name,
                description: req.body.description,
                nameErrors: getFieldErrorMsg(errorsArray, 'name'),
                descriptionErrors: getFieldErrorMsg(errorsArray, 'description'),
                fileErrors: getFieldErrorMsg(errorsArray, 'image'),
            });
        }

        if (req.file?.path === undefined) {
            return renderError500(res);
        }

        const { name, description, visibility } = matchedData(req);

        const isPrivate = await isVisibilityPrivate(Number(visibility));

        if (isPrivate === null) {
            return renderError500(res);
        }

        const uploadData: cloudinaryUploadData = {
            filePath: req.file.path,
            username: req.user.username,
            // @ts-ignore
            // Check is already done within folderChecks
            folderId: folder.folderId,
            fileName: req.body.name,
            authenticated: isPrivate,
        };

        try {
            await imageAPIProvider.upload(uploadData);
            await removeAllUploads();
        } catch (error) {
            console.error(error);
            await removeAllUploads();
            return renderError500(res);
        }

        const creationStatus = await createFile(
            name,
            // @ts-ignore
            // Check is already done within folderChecks
            folder?.folderId,
            Number(visibility),
            description,
        );

        if (creationStatus === null) {
            return renderError500(res);
        }

        return res.redirect(`/folder/${folder?.folderId}`);
    },
];

async function fileActionsInitialChecks(req: Request, res: Response) {
    if (!req.isAuthenticated()) {
        renderError401(res);
        return false;
    }

    const checkResults = await folderChecks(req);

    if (checkResults !== null) {
        checkResults(res);
        return false;
    }

    const options = await getAllVisibilityOptions();

    const folder = await getFolderByUserIdAndFolderId(
        req.user.userId,
        Number(req.params.folderId),
    );

    const file = await getFileByFolderIdAndFileId(
        Number(req.params.folderId),
        Number(req.params.fileId),
    );

    if (file === null) {
        renderError500(res);
        return false;
    }

    return { folder, file, options };
}

const controllerPostEditFile: any = [
    validateFileEdit,
    async (req: Request, res: Response) => {
        const checkResults = await fileActionsInitialChecks(req, res);

        if (checkResults === false) {
            return;
        }

        const { folder, file, options } = checkResults;

        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorsArray = errors.array();

            const visibilityErrors = getFieldErrorMsg(
                errorsArray,
                'visibility',
            );

            if (visibilityErrors.length !== 0) {
                return renderError500(res);
            }

            return res.status(400).render('folder/edit-file', {
                options,
                folder,
                file,
                errors: [{ msg: 'Please fix the errors below' }],
                name: req.body.name,
                description: req.body.description,
                nameErrors: getFieldErrorMsg(errorsArray, 'name'),
                descriptionErrors: getFieldErrorMsg(errorsArray, 'description'),
            });
        }

        const { name, description, visibility } = matchedData(req);

        const currentlyPrivate = await isVisibilityPrivate(file.visibilityId);
        const isPrivate = await isVisibilityPrivate(Number(visibility));

        if (isPrivate === null || currentlyPrivate === null) {
            return renderError500(res);
        }

        const editData: cloudinaryEditData = {
            // @ts-ignore
            username: req.user?.username,
            // @ts-ignore
            folderId: folder?.folderId,
            oldName: file.name,
            newName: name,
            updatedType: isPrivate === true ? 'authenticated' : 'upload',
            currentType: currentlyPrivate === true ? 'authenticated' : 'upload',
        };

        if (
            name !== file.name ||
            editData.updatedType !== editData.currentType
        ) {
            try {
                await imageAPIProvider.edit(editData);
            } catch (error) {
                console.error(error);
                return renderError500(res);
            }
        }

        const updateStatus = await updateFile(
            file.fileId,
            name,
            Number(visibility),
            // @ts-ignore
            folder?.folderId,
            description,
        );

        if (updateStatus === null) {
            return renderError500(res);
        }

        res.redirect(`/folder/${folder?.folderId}/`);
    },
];

export async function controllerPostDeleteFile(req: Request, res: Response) {
    const checkResults = await fileActionsInitialChecks(req, res);

    if (checkResults === false) {
        return;
    }

    const { folder, file } = checkResults;

    const removeData: cloudinaryRemoveData = {
        // @ts-ignore
        username: req.user?.username,
        // @ts-ignore
        folderId: folder?.folderId,
        fileName: file.name,
    };

    try {
        await imageAPIProvider.remove(removeData);
    } catch (error) {
        console.error(error);
        return renderError500(res);
    }

    // @ts-ignore
    const deletionStatus = await deleteFile(file.fileId, folder?.folderId);

    if (deletionStatus === null) {
        return renderError500(res);
    }

    res.redirect(`/folder/${folder?.folderId}/`);
}

export { controllerPostCreateFile, controllerPostEditFile };
