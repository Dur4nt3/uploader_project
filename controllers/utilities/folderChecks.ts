import type { Request, Response } from 'express';

import { renderError401, renderError404 } from './errorsUtilities';
import { getFolderByUserIdAndFolderId } from '../../db/queries/indexQueriesSelect';

type authenticatedReq = Request & {
    user: Express.User
}

// This function verifies the following:
// 1) The user is authenticated
// 2) The user has provided the proper params
// 3) The params are in the right format
// 4) The folder exists
// 5) The folder belongs to the user
// 6) The folder returned has the correct properties
export default async function folderChecks(req: Request) {
    if (!req.isAuthenticated()) {
        return renderError401;
    }

    if (req.params.folderId === undefined) {
        return renderError404;
    }

    const folder = await getFolderByUserIdAndFolderId(
        req.user.userId,
        Number(req.params.folderId),
    );

    if (folder === null || folder.visibility === undefined) {
        return renderError404;
    }

    // No callback => all checks have passed
    return null;
}

export function assumeAuthenticated(req: Request): asserts req is authenticatedReq {}
