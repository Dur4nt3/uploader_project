import { Router } from "express";

import { controllerGetSharedFolder, controllerGetSharedFile } from "../controllers/shareControllersGet";

const shareRouter = Router();

// ------------ GET ROUTES ------------

shareRouter.get('/folder/:folderId', controllerGetSharedFolder);

shareRouter.get('/file/:fileId', controllerGetSharedFile);

// ------------ GET ROUTES ------------


export default shareRouter;