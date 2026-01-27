import type { Request, Response } from 'express';

import { getFolderByFolderId } from '../db/queries/indexQueriesSelect';

import { getFileByFileId } from '../db/queries/folderQueriesSelect';

import filterPrivate from './utilities/filterPrivate';

import { renderError404, renderError500 } from './utilities/errorsUtilities';

import type { apiFetchData } from '../types/apiRequiredData';

import type ImageAPI from '../api/ImageAPI';

export async function controllerGetSharedFolder(req: Request, res: Response) {
    if (req.params.folderId === undefined) {
        return renderError404(res);
    }

    const folderWithFiles = await getFolderByFolderId(
        Number(req.params.folderId),
    );

    if (folderWithFiles === null || folderWithFiles.visibility === undefined) {
        return renderError404(res);
    }

    if (folderWithFiles.visibility.name !== 'public') {
        return renderError404(res);
    }

    // Even if there are no files in the folder
    // The files property will at least be
    // an empty array
    const publicFiles = filterPrivate(folderWithFiles.files);

    res.render('share/share-folder', {
        folder: folderWithFiles,
        files: publicFiles,
    });
}

export async function controllerGetSharedFile(req: Request, res: Response, apiProvider: ImageAPI) {
    if (req.params.fileId === undefined) {
        return renderError404(res);
    }

    const file = await getFileByFileId(Number(req.params.fileId));

    if (
        file === null ||
        file.visibility === undefined ||
        file.folder === null ||
        file.folder.owner === null
    ) {
        return renderError404(res);
    }

    if (file.visibility.name !== 'public') {
        return renderError404(res);
    }

    const fetchData: apiFetchData = {
        username: file.folder.owner.username,
        folderId: String(file.folderId),
        fileName: file.name,
        fileVisibility: file.visibility.name
    };

    let image;

    try {
        image = await apiProvider.fetch(fetchData);
    } catch (error) {
        console.error(error);
        return renderError500(res);
    }

    res.render('share/share-file', { file, image });
}
