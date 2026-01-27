import { Router } from 'express';
import type { Request } from 'express';

import {
    renderError404Custom,
    renderError404,
} from '../controllers/utilities/errorsUtilities';

import {
    controllerGetFolder,
    controllerGetCreateFile,
    controllerGetEditFile,
    controllerGetDeleteFile,
    controllerGetFile,
} from '../controllers/folderControllersGet';
import {
    controllerPostCreateFile,
    controllerPostEditFile,
    controllerPostDeleteFile,
} from '../controllers/folderControllersPost';

import CloudinaryAPI from '../api/CloudinaryAPI';

const apiProvider = new CloudinaryAPI();

const folderRouter = Router();

// ------------ GET ROUTES ------------

folderRouter.get('/:folderId', controllerGetFolder);

folderRouter.get('/:folderId/create-file', controllerGetCreateFile);

folderRouter.get('/:folderId/file/:fileId', (req, res) => controllerGetFile(req, res, apiProvider));

folderRouter.get('/:folderId/edit-file/:fileId', controllerGetEditFile);

folderRouter.get('/:folderId/delete-file/:fileId', controllerGetDeleteFile);


// ------------ GET ROUTES ------------

// ------------ POST ROUTES ------------

folderRouter.post('/:folderId/create-file', controllerPostCreateFile(apiProvider));

folderRouter.post('/:folderId/edit-file/:fileId', controllerPostEditFile(apiProvider));

folderRouter.post('/:folderId/delete-file/:fileId', (req, res) => controllerPostDeleteFile(req, res, apiProvider));

// ------------ POST ROUTES ------------

export default folderRouter;
