import type { Response } from 'express';
import type { ValidationError } from 'express-validator';

export function getFieldErrorMsg(
    errorsArray: ValidationError[],
    field: string,
) {
    let errors = [];

    for (const error of errorsArray) {
        if (error.type === 'field' && error.path === field) {
            errors.push(error.msg);
        }
    }

    return errors;
}

export function renderError500(res: Response) {
    return res.render('error-page', {
        errorTitle: 'Internal Error',
        errorCode: '500',
        errorDesc: "Sorry, we've experienced an internal error.",
    });
}

export function renderError404(res: Response) {
    return res.render('error-page', {
        errorTitle: 'Not Found',
        errorCode: '404',
        errorDesc: 'Could not find the requested page.',
    });
}

export function renderError401(res: Response) {
    return res.render('error-page', {
        errorTitle: 'Unauthorized',
        errorCode: '401',
        errorDesc: "You're not authorized to perform this action!",
        customAction: true,
        customActionPrefix: 'Please',
        customActionLink: '/login',
        customActionText: 'Login',
    });
}
