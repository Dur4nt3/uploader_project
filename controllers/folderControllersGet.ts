import type { Request, Response } from 'express';

import { renderError401, renderError404 } from './utilities/errorsUtilities';
import { getFolderByUserIdAndFolderId } from '../db/queries/indexQueriesSelect';
import { getFilesByFolderId } from '../db/queries/folderQueriesSelect';

export async function controllerGetFolder(req: Request, res: Response) {
    if (!req.isAuthenticated()) {
        return renderError401(res);
    }

    if (req.params === undefined || req.params.folderId === undefined) {
        return renderError404(res);
    }

    const folder = await getFolderByUserIdAndFolderId(
        req.user.userId,
        Number(req.params.folderId),
    );

    if (folder === null) {
        return renderError404(res);
    }

    const files = await getFilesByFolderId(Number(req.params.folderId));

    return res.render('folder/folder', { folder, files });
}
