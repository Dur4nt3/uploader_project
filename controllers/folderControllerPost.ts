import type { Request, Response } from 'express';
import { matchedData, validationResult } from 'express-validator';

import { validateFile } from './utilities/validationUtilities';
import { getFieldErrorMsg, renderError500, renderError401 } from './utilities/errorsUtilities';

import { createFile } from '../db/queries/folderQueriesInsert';

const controllerPostCreateFile: any = [
    validateFile,
    async (req: Request, res: Response) => {
        if (!req.isAuthenticated()) {
            return renderError401(res);
        }
    },
];

export { controllerPostCreateFile };
