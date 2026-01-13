import type { Request, Response } from 'express';

import { renderError401 } from './utilities/errorsUtilities';
import {
    getFoldersByUserId,
    getAllVisibilityOptions,
} from '../db/queries/indexQueries';

export async function controllerGetIndex(req: Request, res: Response) {
    let username = null;
    let name = null;
    let folders = null;

    if (req.isAuthenticated()) {
        ({ username } = req.user);
        ({ name } = req.user);
        folders = await getFoldersByUserId(req.user.userId);
    }

    res.render('root/index', {
        authenticated: req.isAuthenticated(),
        username,
        name,
        folders,
    });
}

export function controllerGetLogin(req: Request, res: Response) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }

    res.render('root/login');
}

export function controllerGetSignup(req: Request, res: Response) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }

    res.render('root/signup');
}

export function controllerGetHelp(req: Request, res: Response) {
    res.render('root/help');
}

export function controllerGetLogout(req: Request, res: Response) {
    let username = null;
    if (req.isAuthenticated()) {
        ({ username } = req.user);
    } else {
        return res.redirect('/');
    }

    res.render('root/logout', {
        authenticated: req.isAuthenticated(),
        username,
    });
}

export async function controllerGetCreateFolder(req: Request, res: Response) {
    if (!req.isAuthenticated()) {
        return renderError401(res);
    }

    const options = await getAllVisibilityOptions();

    res.render('root/create-folder', { options });
}
