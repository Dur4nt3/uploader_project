import { Router } from 'express';

import {
    controllerGetIndex,
    controllerGetLogin,
    controllerGetSignup,
    controllerGetHelp,
} from '../controllers/indexControllers';

const indexRouter = Router();

// ------------ GET ROUTES ------------

indexRouter.get('/', controllerGetIndex);

indexRouter.get('/login', controllerGetLogin);

indexRouter.get('/signup', controllerGetSignup);

indexRouter.get('/help', controllerGetHelp);

// ------------ GET ROUTES ------------

// ------------ POST ROUTES ------------

// ------------ POST ROUTES ------------

export default indexRouter;
