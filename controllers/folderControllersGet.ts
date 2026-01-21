import type { Request, Response } from 'express';

import {
    renderError401,
    renderError404,
    renderError500,
} from './utilities/errorsUtilities';

import folderChecks, { assumeAuthenticated } from './utilities/folderChecks';

import {
    getFolderByUserIdAndFolderId,
    getAllVisibilityOptions,
    isVisibilityPrivate,
    isVisibilityPublic
} from '../db/queries/indexQueriesSelect';
import {
    getFilesByFolderId,
    getFileByFolderIdAndFileId,
} from '../db/queries/folderQueriesSelect';

import type { cloudinaryFetchData } from '../types/cloudinaryRequiredData';

import CloudinaryAPI from '../api/CloudinaryAPI';

const imageAPIProvider = new CloudinaryAPI();

export async function controllerGetFolder(req: Request, res: Response) {
    const checkResults = await folderChecks(req);

    if (checkResults !== null) {
        return checkResults(res);
    }

    assumeAuthenticated(req);

    const folder = await getFolderByUserIdAndFolderId(
        req.user.userId,
        Number(req.params.folderId),
    );

    const files = await getFilesByFolderId(Number(req.params.folderId));

    // @ts-ignore
    const isPublic = await isVisibilityPublic(folder?.visibilityId)
    
    const baseUrl = req.host;

    return res.render('folder/folder', { folder, files, isPublic, baseUrl });
}

export async function controllerGetCreateFile(req: Request, res: Response) {
    const checkResults = await folderChecks(req);

    if (checkResults !== null) {
        return checkResults(res);
    }

    assumeAuthenticated(req);

    const folder = await getFolderByUserIdAndFolderId(
        req.user.userId,
        Number(req.params.folderId),
    );

    const options = await getAllVisibilityOptions();

    return res.render('folder/create-file', { folder, options });
}

// Ensures that:
// 1) the file and folder exist (includes validating id formats)
// 2) the file and folder belong to the user
async function fileActionsChecks(req: Request, res: Response) {
    if (!req.isAuthenticated()) {
        renderError401(res);
        return false;
    }

    const checkResults = await folderChecks(req);

    if (checkResults !== null) {
        checkResults(res);
        return false;
    }

    const folder = await getFolderByUserIdAndFolderId(
        req.user.userId,
        Number(req.params.folderId),
    );

    const options = await getAllVisibilityOptions();

    const file = await getFileByFolderIdAndFileId(
        // @ts-ignore
        folder?.folderId,
        Number(req.params.fileId),
    );

    if (file === null) {
        renderError404(res);
        return false;
    }

    return { folder, file, options };
}

export async function controllerGetEditFile(req: Request, res: Response) {
    const checkResults = await fileActionsChecks(req, res);

    if (checkResults === false) {
        return;
    }

    const { folder, file, options } = checkResults;

    return res.render('folder/edit-file', { folder, file, options });
}

export async function controllerGetDeleteFile(req: Request, res: Response) {
    const checkResults = await fileActionsChecks(req, res);

    if (checkResults === false) {
        return;
    }

    const { folder, file, options } = checkResults;

    return res.render('folder/delete-file', { folder, file, options });
}

export async function controllerGetFile(req: Request, res: Response) {
    const checkResults = await fileActionsChecks(req, res);

    if (checkResults === false) {
        return;
    }

    assumeAuthenticated(req);

    const { folder, file } = checkResults;

    const isPrivate = await isVisibilityPrivate(file.visibilityId);

    const uploadType = isPrivate === true ? 'authenticated' : 'upload';

    const fetchData: cloudinaryFetchData = {
        username: req.user?.username,
        // @ts-ignore
        folderId: folder?.folderId,
        fileName: file.name,
        uploadType
    }

    let image;

    try {
        image = await imageAPIProvider.fetch(fetchData);
    } catch (error) {
        console.error(error);
        return renderError500(res);
    }

    // @ts-ignore
    const isPublic = await isVisibilityPublic(file?.visibilityId)
    
    const baseUrl = req.host;

    res.render('folder/view-file', { folder, file, image, isPublic, baseUrl });
}
