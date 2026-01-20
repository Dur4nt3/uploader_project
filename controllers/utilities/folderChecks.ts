import type { Request, Response } from 'express';

import { renderError401, renderError404 } from './errorsUtilities';
import { getFolderByUserIdAndFolderId } from '../../db/queries/indexQueriesSelect';

type authenticatedReq = Request & {
    user: Express.User
}

export default async function folderChecks(req: Request) {
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

export function assumeAuthenticated(req: Request): asserts req is authenticatedReq {}
