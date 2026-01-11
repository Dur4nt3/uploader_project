import passport from 'passport';
import type { Request, Response } from 'express';
import { matchedData, validationResult } from 'express-validator';

import { generatePassword } from '../auth/passwordUtils';
import { validateSignup } from './utilities/validationUtilities';
import { getFieldErrorMsg, renderError500 } from './utilities/errorsUtilities';
import { createUser, getFoldersByUserId } from '../db/queries/indexQueries';

// ------------ GET ROUTES ------------

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

export function controllerGetCreateFolder(req: Request, res: Response) {
    res.send('wip');
}

// ------------ GET ROUTES ------------

// ------------ POST ROUTES ------------

function controllerPassportLogin(
    req: Request,
    res: Response,
    err: any,
    user: any,
    info: any,
) {
    if (!user) {
        res.render('root/login', {
            errors: [{ msg: 'Incorrect username or password' }],
        });
        return;
    }

    req.login(user, (err) => {
        if (err) {
            console.log('Could not authenticate user: ', err);
            return renderError500(res);
        }

        res.redirect('/');
    });
}

export function controllerPostLogin(req: Request, res: Response) {
    passport.authenticate('local', (err: any, user: any, info: any) =>
        controllerPassportLogin(req, res, err, user, info),
    )(req, res);
}

const controllerPostSignup: any = [
    validateSignup,
    async (req: Request, res: Response) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            const errorsArray = errors.array();

            return res.status(400).render('root/signup', {
                errors: [{ msg: 'Please fix the errors below' }],
                username: req.body.username,
                name: req.body.name,
                usernameErrors: getFieldErrorMsg(errorsArray, 'username'),
                nameErrors: getFieldErrorMsg(errorsArray, 'name'),
                passwordErrors: getFieldErrorMsg(errorsArray, 'password'),
                cPasswordErrors: getFieldErrorMsg(errorsArray, 'cpassword'),
            });
        }

        const { username, name, password } = matchedData(req);
        const hashedPassword = await generatePassword(password);

        const creationStatus = await createUser(username, name, hashedPassword);

        if (creationStatus === null) {
            return renderError500(res);
        }

        return res.redirect('/login');
    },
];

export function controllerPostLogout(req: Request, res: Response) {
    if (!req.isAuthenticated()) {
        return;
    }

    req.logout((err) => {
        if (err) {
            console.log('Could not logout user: ', err);
            return renderError500(res);
        }
        res.redirect('/');
    });
}

// ------------ POST ROUTES ------------

export { controllerPostSignup };
