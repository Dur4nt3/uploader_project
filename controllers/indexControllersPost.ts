import passport from 'passport';
import type { Request, Response } from 'express';
import { matchedData, validationResult } from 'express-validator';

import { generatePassword } from '../auth/passwordUtils';

import {
    validateSignup,
    validateFolder,
} from './utilities/validationUtilities';

import {
    getFieldErrorMsg,
    renderError500,
    renderError401,
} from './utilities/errorsUtilities';

import { createUser, createFolder } from '../db/queries/indexQueriesInsert';

import { updateFolder } from '../db/queries/indexQueriesUpdate';

import { deleteFolder } from '../db/queries/indexQueriesDelete';

import {
    getAllVisibilityOptions,
    getFolderByUserIdAndFolderId,
    isUserAllowToCreateFolder,
} from '../db/queries/indexQueriesSelect';

import { getFilesByFolderId } from '../db/queries/folderQueriesSelect';

import type { cloudinaryRemoveMultipleData } from '../types/cloudinaryRequiredData';

import CloudinaryAPI from '../api/CloudinaryAPI';

const imageAPIProvider = new CloudinaryAPI();

function controllerPassportLogin(
    req: Request,
    res: Response,
    err: any,
    user: any,
    info: any,
) {
    if (!user) {
        res.render('root/login', {
            errors: [{ msg: 'Incorrect username or password' }],
        });
        return;
    }

    req.login(user, (err) => {
        if (err) {
            console.log('Could not authenticate user: ', err);
            return renderError500(res);
        }

        res.redirect('/');
    });
}

export function controllerPostLogin(req: Request, res: Response) {
    passport.authenticate('local', (err: any, user: any, info: any) =>
        controllerPassportLogin(req, res, err, user, info),
    )(req, res);
}

const controllerPostSignup: any = [
    validateSignup,
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorsArray = errors.array();

            return res.status(400).render('root/signup', {
                errors: [{ msg: 'Please fix the errors below' }],
                username: req.body.username,
                name: req.body.name,
                usernameErrors: getFieldErrorMsg(errorsArray, 'username'),
                nameErrors: getFieldErrorMsg(errorsArray, 'name'),
                passwordErrors: getFieldErrorMsg(errorsArray, 'password'),
                cPasswordErrors: getFieldErrorMsg(errorsArray, 'cpassword'),
            });
        }

        const { username, name, password } = matchedData(req);
        const hashedPassword = await generatePassword(password);

        const creationStatus = await createUser(username, name, hashedPassword);

        if (creationStatus === null) {
            return renderError500(res);
        }

        return res.redirect('/login');
    },
];

export function controllerPostLogout(req: Request, res: Response) {
    if (!req.isAuthenticated()) {
        return;
    }

    req.logout((err) => {
        if (err) {
            console.log('Could not logout user: ', err);
            return renderError500(res);
        }
        res.redirect('/');
    });
}

const controllerPostCreateFolder: any = [
    validateFolder,
    async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return renderError401(res);
        }

        let options;

        const creationAuthorized = await isUserAllowToCreateFolder(
            req.user.userId,
        );

        if (!creationAuthorized) {
            options = await getAllVisibilityOptions();

            return res.status(400).render('root/create-folder', {
                errors: [{ msg: "You've reached the folder limit" }],
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

            return res.status(400).render('root/create-folder', {
                options,
                errors: [{ msg: 'Please fix the errors below' }],
                name: req.body.name,
                description: req.body.description,
                nameErrors: getFieldErrorMsg(errorsArray, 'name'),
                descriptionErrors: getFieldErrorMsg(errorsArray, 'description'),
            });
        }

        const { name, description, visibility } = matchedData(req);

        const userId = req.user.userId;

        const creationStatus = await createFolder(
            name,
            userId,
            Number(visibility),
            description,
        );

        if (creationStatus === null) {
            return renderError500(res);
        }

        return res.redirect('/');
    },
];

const controllerPostEditFolder: any = [
    validateFolder,
    async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return renderError401(res);
        }

        if (req.params.folderId === undefined) {
            return renderError500(res);
        }

        // Checking if the folder to be updated exists and actually belongs to the user
        const isOwner = await getFolderByUserIdAndFolderId(
            req.user.userId,
            Number(req.params.folderId),
        );

        if (isOwner === null) {
            return renderError500(res);
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

            const options = await getAllVisibilityOptions();

            return res.status(400).render('root/edit-folder', {
                options,
                errors: [{ msg: 'Please fix the errors below' }],
                name: req.body.name,
                description: req.body.description,
                nameErrors: getFieldErrorMsg(errorsArray, 'name'),
                descriptionErrors: getFieldErrorMsg(errorsArray, 'description'),
                folder: isOwner,
            });
        }

        const { name, description, visibility } = matchedData(req);

        const userId = req.user.userId;

        const updateStatus = await updateFolder(
            Number(req.params.folderId),
            name,
            Number(visibility),
            userId,
            description,
        );

        if (updateStatus === null) {
            return renderError500(res);
        }

        return res.redirect('/');
    },
];

export async function controllerPostDeleteFolder(req: Request, res: Response) {
    if (!req.isAuthenticated()) {
        return renderError401(res);
    }

    if (req.params.folderId === undefined) {
        return renderError500(res);
    }

    // Checking if the folder to be delete exists and actually belongs to the user
    const isOwner = await getFolderByUserIdAndFolderId(
        req.user.userId,
        Number(req.params.folderId),
    );

    if (isOwner === null) {
        return renderError500(res);
    }

    const allFiles = await getFilesByFolderId(isOwner.folderId);

    if (allFiles === null) {
        return renderError500(res);
    }

    const removeMultipleData: cloudinaryRemoveMultipleData = {
        username: req.user.username,
        folderId: isOwner.folderId,
        files: allFiles
    }

    try {
        await imageAPIProvider.removeMultiple(removeMultipleData);
    } catch (error) {
        console.error(error);
        return renderError500(res);
    }

    const deleteStatus = await deleteFolder(
        req.user.userId,
        Number(req.params.folderId),
    );

    if (deleteStatus === null) {
        return renderError500(res);
    }

    return res.redirect('/');
}

export {
    controllerPostSignup,
    controllerPostCreateFolder,
    controllerPostEditFolder,
};
