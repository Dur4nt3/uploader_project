import type { Request, Response } from 'express';
import { matchedData, validationResult } from 'express-validator';

import multer from 'multer';

import removeAllUploads from './utilities/removeAllUploads';

import folderChecks from './utilities/folderChecks';
import { validateFile } from './utilities/validationUtilities';
import {
    getFieldErrorMsg,
    renderError500,
    renderError401,
    renderError404,
} from './utilities/errorsUtilities';

import {
    getAllVisibilityOptions,
    getFolderByUserIdAndFolderId,
} from '../db/queries/indexQueriesSelect';
import { isUserAllowedToCreateFile } from '../db/queries/folderQueriesSelect';
import { createFile } from '../db/queries/folderQueriesInsert';

import { cloudinaryUploadImage } from '../cloudinary/cloudinaryCalls';

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

        let uploadResult;

        if (req.file?.path === undefined) {
            return renderError500(res);
        }

        try {
            uploadResult = await cloudinaryUploadImage(
                req.file?.path,
                req.user.username,
                // @ts-ignore
                // Check is already done within folderChecks
                folder.folderId,
                req.body.name,
            );

            await removeAllUploads();
        } catch (error) {
            console.error(error);
            await removeAllUploads();
            return renderError500(res);
        }

        const { name, description, visibility } = matchedData(req);

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

export { controllerPostCreateFile };
