import { Router } from 'express';

import {
    controllerGetIndex,
    controllerGetLogin,
    controllerGetSignup,
    controllerGetHelp,
    controllerGetLogout,
    controllerGetCreateFolder,
    controllerPostLogin,
    controllerPostSignup,
    controllerPostLogout,
} from '../controllers/indexControllers';

const indexRouter = Router();

// ------------ GET ROUTES ------------

indexRouter.get('/', controllerGetIndex);

indexRouter.get('/signup', controllerGetSignup);

indexRouter.get('/login', controllerGetLogin);

indexRouter.get('/help', controllerGetHelp);

indexRouter.get('/logout', controllerGetLogout);

indexRouter.get('/create-folder', controllerGetCreateFolder);

// ------------ GET ROUTES ------------

// ------------ POST ROUTES ------------

indexRouter.post('/signup', controllerPostSignup);

indexRouter.post('/login', controllerPostLogin);

indexRouter.post('/logout', controllerPostLogout);

// ------------ POST ROUTES ------------

export default indexRouter;
