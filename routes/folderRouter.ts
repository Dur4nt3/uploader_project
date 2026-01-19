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
} from '../controllers/folderControllersGet';
import {
    controllerPostCreateFile,
    controllerPostEditFile,
    controllerPostDeleteFile,
} from '../controllers/folderControllerPost';

const folderRouter = Router();

// ------------ GET ROUTES ------------

folderRouter.get('/:folderId', controllerGetFolder);

folderRouter.get('/:folderId/create-file', controllerGetCreateFile);

folderRouter.get('/:folderId/edit-file/:fileId', controllerGetEditFile);

folderRouter.get('/:folderId/delete-file/:fileId', controllerGetDeleteFile);

// ------------ GET ROUTES ------------

// ------------ POST ROUTES ------------

folderRouter.post('/:folderId/create-file', controllerPostCreateFile);

folderRouter.post('/:folderId/edit-file/:fileId', controllerPostEditFile);

folderRouter.post('/:folderId/delete-file/:fileId', controllerPostDeleteFile);

// ------------ POST ROUTES ------------

export default folderRouter;
