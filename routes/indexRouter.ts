import { Router } from 'express';

import {
    controllerGetIndex,
    controllerGetLogin,
    controllerGetSignup,
    controllerGetHelp,
    controllerGetLogout,
    controllerGetCreateFolder,
    controllerGetEditFolder,
} from '../controllers/indexControllersGet';

import {
    controllerPostLogin,
    controllerPostSignup,
    controllerPostLogout,
    controllerPostCreateFolder,
    controllerPostEditFolder,
} from '../controllers/indexControllersPost';

const indexRouter = Router();

// ------------ GET ROUTES ------------

indexRouter.get('/', controllerGetIndex);

indexRouter.get('/signup', controllerGetSignup);

indexRouter.get('/login', controllerGetLogin);

indexRouter.get('/help', controllerGetHelp);

indexRouter.get('/logout', controllerGetLogout);

indexRouter.get('/create-folder', controllerGetCreateFolder);

indexRouter.get('/edit-folder/:folderId', controllerGetEditFolder);

// ------------ GET ROUTES ------------

// ------------ POST ROUTES ------------

indexRouter.post('/signup', controllerPostSignup);

indexRouter.post('/login', controllerPostLogin);

indexRouter.post('/logout', controllerPostLogout);

indexRouter.post('/create-folder', controllerPostCreateFolder);

indexRouter.post('/edit-folder/:folderId', controllerPostEditFolder);

// ------------ POST ROUTES ------------

export default indexRouter;
