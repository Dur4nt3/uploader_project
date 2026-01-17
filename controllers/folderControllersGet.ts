import type { Request, Response } from 'express';

import { renderError401, renderError404 } from './utilities/errorsUtilities';
import { getFolderByUserIdAndFolderId } from '../db/queries/indexQueriesSelect';
import { getFilesByFolderId } from '../db/queries/folderQueriesSelect';

async function folderChecks(req: Request) {
    if (!req.isAuthenticated()) {
        return renderError401;
    }

    if (req.params.folderId === undefined) {
        return renderError404;
    }

    // Checks:
    // 1) Param: folderId is in the correct format
    // 2) Folder exists
    // 3) Folder belongs to the user
    const folder = await getFolderByUserIdAndFolderId(
        req.user.userId,
        Number(req.params.folderId),
    );

    if (folder === null) {
        return renderError404;
    }

    // Indicates that all checks have passed
    // and there's no need to execute a callback
    return null;
}

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

    return res.render('folder/create-file', { folder });
}
