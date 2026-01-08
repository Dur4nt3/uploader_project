import type { Request, Response } from 'express';

// ------------ GET ROUTES ------------

export async function controllerGetIndex(req: Request, res: Response) {
    res.render('root/index', { authenticated: req.isAuthenticated() });
}

export async function controllerGetLogin(req: Request, res: Response) {
    res.render('root/login');
}

export async function controllerGetSignup(req: Request, res: Response) {
    res.render('root/signup');
}

export async function controllerGetHelp(req: Request, res: Response) {
    res.render('root/help');
}

// ------------ GET ROUTES ------------

// ------------ POST ROUTES ------------

// ------------ POST ROUTES ------------
