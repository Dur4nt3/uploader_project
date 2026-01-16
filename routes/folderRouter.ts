import { Router } from 'express';
import type { Request } from 'express';

import { renderError404Custom, renderError404 } from '../controllers/utilities/errorsUtilities';

import { controllerGetFolder } from '../controllers/folderControllersGet';

const folderRouter = Router();

// ------------ GET ROUTES ------------

folderRouter.get('/:folderId', controllerGetFolder);

// ------------ GET ROUTES ------------

// ------------ POST ROUTES ------------

// ------------ POST ROUTES ------------

// ------------ ERROR ROUTES ------------


folderRouter.use('/', (req: Request, res) => {
    const previousUrl = req.get('Referer');

    if (previousUrl === undefined) {
        return renderError404(res);
    }

    return renderError404Custom(res, 'Go', previousUrl, 'Back');
})

// ------------ ERROR ROUTES ------------

export default folderRouter;
