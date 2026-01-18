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
} from './utilities/errorsUtilities';

import {
    getAllVisibilityOptions,
    getFolderByUserIdAndFolderId,
} from '../db/queries/indexQueriesSelect';
import { isUserAllowedToCreateFile } from '../db/queries/folderQueriesSelect';
import { createFile } from '../db/queries/folderQueriesInsert';

const multerStorage = multer.diskStorage({
    destination: 'uploads/',
    filename: (req, file, callback) => {
        callback(null, file.originalname + '-' + Math.round(Math.random() * 1E6));
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
            const folder = await getFolderByUserIdAndFolderId(
                req.user.userId,
                Number(req.params.folderId),
            );

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

        res.send('ready to create file!');
    },
];

export { controllerPostCreateFile };
