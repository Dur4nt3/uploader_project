import type { Request, Response } from 'express';

import { renderError401, renderError404 } from './utilities/errorsUtilities';

import folderChecks from './utilities/folderChecks';

import {
    getFolderByUserIdAndFolderId,
    getAllVisibilityOptions,
} from '../db/queries/indexQueriesSelect';
import { getFilesByFolderId } from '../db/queries/folderQueriesSelect';

export async function controllerGetFolder(req: Request, res: Response) {
    // For TypeScript
    // Asserts that req.user isn't undefined
    if (!req.isAuthenticated()) {
        return renderError401(res);
    }

    const checkResults = await folderChecks(req);

    if (checkResults !== null) {
        return checkResults(res);
    }

    const folder = await getFolderByUserIdAndFolderId(
        req.user.userId,
        Number(req.params.folderId),
    );

    const files = await getFilesByFolderId(Number(req.params.folderId));

    return res.render('folder/folder', { folder, files });
}

export async function controllerGetCreateFile(req: Request, res: Response) {
    // For TypeScript
    // Asserts that req.user isn't undefined
    if (!req.isAuthenticated()) {
        return renderError401(res);
    }

    const checkResults = await folderChecks(req);

    if (checkResults !== null) {
        return checkResults(res);
    }

    const folder = await getFolderByUserIdAndFolderId(
        req.user.userId,
        Number(req.params.folderId),
    );

    const options = await getAllVisibilityOptions();

    return res.render('folder/create-file', { folder, options });
}
