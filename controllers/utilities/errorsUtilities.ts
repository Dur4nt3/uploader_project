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
