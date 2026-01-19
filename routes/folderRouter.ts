import { Router } from 'express';
import type { Request } from 'express';

import { renderError404Custom, renderError404 } from '../controllers/utilities/errorsUtilities';

import { controllerGetFolder, controllerGetCreateFile, controllerGetEditFile } from '../controllers/folderControllersGet';
import { controllerPostCreateFile, controllerPostEditFile } from '../controllers/folderControllerPost';

const folderRouter = Router();

// ------------ GET ROUTES ------------

folderRouter.get('/:folderId', controllerGetFolder);

folderRouter.get('/:folderId/create-file', controllerGetCreateFile);

folderRouter.get('/:folderId/edit-file/:fileId', controllerGetEditFile)

// ------------ GET ROUTES ------------

// ------------ POST ROUTES ------------

folderRouter.post('/:folderId/create-file', controllerPostCreateFile);

folderRouter.post('/:folderId/edit-file/:fileId', controllerPostEditFile);

// ------------ POST ROUTES ------------

export default folderRouter;
