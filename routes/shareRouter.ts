import { Router } from "express";

import CloudinaryAPI from '../api/CloudinaryAPI';

import { controllerGetSharedFolder, controllerGetSharedFile } from "../controllers/shareControllersGet";

const apiProvider = new CloudinaryAPI();

const shareRouter = Router();

// ------------ GET ROUTES ------------

shareRouter.get('/folder/:folderId', controllerGetSharedFolder);

shareRouter.get('/file/:fileId', (req, res) => controllerGetSharedFile(req, res, apiProvider));

// ------------ GET ROUTES ------------


export default shareRouter;