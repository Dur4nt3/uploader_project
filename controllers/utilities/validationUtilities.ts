import { body } from 'express-validator';
import {
    isUsernameUnique,
    isUserFolderUnique,
    isValidVisibilityId,
    getFolderByUserIdAndName,
} from '../../db/queries/indexQueriesSelect';

import { isUserFileUnique } from '../../db/queries/folderQueriesSelect';

const emptyErr = 'must not be empty';
const lengthErr = 'must be between 3 and 30 characters';
const passwordLengthErr = 'must be at least 8 characters long';
const descLengthErr = 'must be between 3 and 50 characters';
const alphaNumericErr = 'must only contain letters and numbers';

const validMimeTypes = /png|jpeg|jpg|webp/
// 5 MB = 5 BYTES * 1024 * 1024
const maxFileSize = 5 * 1024 * 1024

const validateSignup = [
    body('username')
        .notEmpty()
        .withMessage(`Username ${emptyErr}`)
        .bail()
        .isAlphanumeric()
        .withMessage(`Username ${alphaNumericErr}`)
        .bail()
        .custom(async (username) => {
            const unique = await isUsernameUnique(username);
            if (!unique) {
                throw new Error('Username already exists');
            }
            return true;
        })
        .bail()
        .isLength({ min: 3, max: 30 })
        .withMessage(`Username ${lengthErr}`),

    body('name')
        .trim()
        .notEmpty()
        .withMessage(`Name ${emptyErr}`)
        .bail()
        .isAlphanumeric('en-US', { ignore: ' ' })
        .withMessage(`Name ${alphaNumericErr}`)
        .bail()
        .isLength({ min: 3, max: 30 })
        .withMessage(`Name ${lengthErr}`),

    body('password')
        .notEmpty()
        .withMessage(`Password ${emptyErr}`)
        .bail()
        .isLength({ min: 8 })
        .withMessage(`Password ${passwordLengthErr}`),

    body('cpassword')
        .notEmpty()
        .withMessage(`Please verify your password`)
        .bail()
        .custom((cpassword, { req }) => {
            if (cpassword !== req.body.password) {
                throw new Error('Passwords do not match');
            }
            return true;
        }),
];

const validateFolder = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage(`Folder name ${emptyErr}`)
        .bail()
        .isAlphanumeric('en-US', { ignore: /[\s'._\-()&]/g })
        .withMessage(`Folder name ${alphaNumericErr}`)
        .bail()
        .custom(async (name, { req }) => {
            const unique = await isUserFolderUnique(req.user.userId, name);
            if (!unique) {
                if (
                    req.url.includes('edit-folder') &&
                    req.params !== undefined
                ) {
                    const folderWithSelectedName =
                        await getFolderByUserIdAndName(req.user.userId, name);
                    if (
                        folderWithSelectedName?.folderId ===
                        Number(req.params.folderId)
                    ) {
                        return true;
                    }
                }

                throw new Error(`Folder "${name}" already exists`);
            }
            return true;
        })
        .bail()
        .isLength({ min: 3, max: 30 })
        .withMessage(`Folder name ${lengthErr}`),

    body('description')
        .trim()
        .optional({ values: 'falsy' })
        .isAlphanumeric('en-US', { ignore: /[\s'._\-()&]/g })
        .withMessage(`Folder description ${alphaNumericErr}`)
        .bail()
        .isLength({ min: 3, max: 50 })
        .withMessage(`Folder description ${descLengthErr}`),

    body('visibility').custom(async (value) => {
        let valid;

        if (!Number.isInteger(Number(value))) {
            throw new Error(`Visibility option format is invalid!`);
        }

        valid = await isValidVisibilityId(Number(value));

        if (!valid) {
            throw new Error(`Visibility option doesn't exist!`);
        }

        return true;
    }),
];

const validateFile = [
    body('name')
        .trim()
        .notEmpty()
        .withMessage(`File name ${emptyErr}`)
        .bail()
        .isAlphanumeric()
        .withMessage(`File name ${alphaNumericErr}`)
        .bail()
        .custom(async (name, { req }) => {
            if (req.params === undefined) {
                throw new Error();
            }

            const unique = await isUserFileUnique(
                Number(req.params.folderId),
                name,
            );

            if (unique === null || unique.length > 0) {
                throw new Error(`File "${name}" already exists`);
            }
            
            return true;
        })
        .bail()
        .isLength({ min: 3, max: 30 })
        .withMessage(`Folder name ${lengthErr}`),

    body('description')
        .trim()
        .optional({ values: 'falsy' })
        .isAlphanumeric('en-US', { ignore: /[\s'._\-()&]/g })
        .withMessage(`File description ${alphaNumericErr}`)
        .bail()
        .isLength({ min: 3, max: 50 })
        .withMessage(`File description ${descLengthErr}`),

    body('visibility').custom(async (value) => {
        let valid;

        if (!Number.isInteger(Number(value))) {
            throw new Error(`Visibility option format is invalid!`);
        }

        valid = await isValidVisibilityId(Number(value));

        if (!valid) {
            throw new Error(`Visibility option doesn't exist!`);
        }

        return true;
    }),

    // Note: placeholder will always be undefined
    // We are using "req.file" for the validation
    body('image').custom(async (placeholder, { req }) => {
        const { file } = req;

        if (file === undefined) {
            throw new Error('Please select an image')
        }
        
        if (!validMimeTypes.test(file.mimetype)) {
            throw new Error('Invalid file type');
        }

        if (file.size > (maxFileSize)) {
            throw new Error('Image exceeds maximum size');
        }

        return true;
    }),
];

export { validateSignup, validateFolder, validateFile };
