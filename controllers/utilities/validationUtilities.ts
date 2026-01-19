import { body } from 'express-validator';
import {
    isUsernameUnique,
    isUserFolderUnique,
    isValidVisibilityId,
    getFolderByUserIdAndName,
} from '../../db/queries/indexQueriesSelect';

import { isUserFileUnique, getFileByFolderIdAndName } from '../../db/queries/folderQueriesSelect';

const emptyErr = 'must not be empty';
const lengthErr = 'must be between 3 and 30 characters';
const passwordLengthErr = 'must be at least 8 characters long';
const descLengthErr = 'must be between 3 and 50 characters';
const alphaNumericErr =
    'must only contain letters and numbers (lowercase only)';
const specialAlphaNumericErr = 'must only contain letters and numbers';

const validMimeTypes = /png|jpeg|jpg|webp/;
// 5 MB = 5 BYTES * 1024 * 1024
const maxFileSize = 5 * 1024 * 1024;

function identifierStringValidation(
    targetEntity: string,
    targetField: string,
    regex: RegExp,
    errorVar?: string,
) {
    return body(targetField)
        .trim()
        .notEmpty()
        .withMessage(`${targetEntity} ${emptyErr}`)
        .bail()
        .matches(regex)
        .withMessage(
            `${targetEntity} ${errorVar !== undefined ? errorVar : alphaNumericErr}`,
        )
        .bail()
        .isLength({ min: 3, max: 30 })
        .withMessage(`${targetEntity} ${lengthErr}`);
}

function descriptionValidation(targetEntity: string) {
    return body('description')
        .trim()
        .optional({ values: 'falsy' })
        .isAlphanumeric('en-US', { ignore: /[\s'._\-()&]/g })
        .withMessage(`${targetEntity} description ${specialAlphaNumericErr}`)
        .bail()
        .isLength({ min: 3, max: 50 })
        .withMessage(`${targetEntity} description ${descLengthErr}`);
}

function visibilityValidation() {
    return body('visibility').custom(async (value) => {
        let valid;

        if (!Number.isInteger(Number(value))) {
            throw new Error(`Visibility option format is invalid!`);
        }

        valid = await isValidVisibilityId(Number(value));

        if (!valid) {
            throw new Error(`Visibility option doesn't exist!`);
        }

        return true;
    });
}

const validateSignup = [
    identifierStringValidation('Username', 'username', /^[a-z0-9]+$/).custom(
        async (username) => {
            const unique = await isUsernameUnique(username);
            if (!unique) {
                throw new Error('Username already exists');
            }
            return true;
        },
    ),

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
    identifierStringValidation(
        'Folder name',
        'name',
        /^[A-Za-z0-9\s'._\-()&]+$/,
        specialAlphaNumericErr,
    ).custom(async (name, { req }) => {
        const unique = await isUserFolderUnique(req.user.userId, name);
        if (!unique) {
            if (req.url.includes('edit-folder') && req.params !== undefined) {
                const folderWithSelectedName = await getFolderByUserIdAndName(
                    req.user.userId,
                    name,
                );
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
    }),

    descriptionValidation('Folder'),

    visibilityValidation(),
];

const validateFile = [
    identifierStringValidation('File name', 'name', /^[a-z0-9\-]+$/).custom(
        async (name, { req }) => {
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
        },
    ),

    descriptionValidation('File'),

    visibilityValidation(),

    // Note: placeholder will always be undefined
    // We are using "req.file" for the validation
    body('image').custom(async (placeholder, { req }) => {
        const { file } = req;

        if (file === undefined) {
            throw new Error('Please select an image');
        }

        if (!validMimeTypes.test(file.mimetype)) {
            throw new Error('Invalid file type');
        }

        if (file.size > maxFileSize) {
            throw new Error('Image exceeds maximum size');
        }

        return true;
    }),
];

const validateFileEdit = [
    identifierStringValidation('File name', 'name', /^[a-z0-9\-]+$/).custom(
        async (name, { req }) => {
            if (req.params === undefined) {
                throw new Error();
            }

            const unique = await isUserFileUnique(
                Number(req.params.folderId),
                name,
            );

            if (unique === null || unique.length > 0) {
                if (req.url.includes('edit-file')) {
                    const fileWithSelectedName = await getFileByFolderIdAndName(Number(req.params.folderId), name);
                    if (fileWithSelectedName?.fileId === Number(req.params.fileId)) {
                        return true;
                    }
                }

                throw new Error(`File "${name}" already exists`);
            }

            return true;
        },
    ),

    descriptionValidation('File'),

    visibilityValidation(),
];

export { validateSignup, validateFolder, validateFile, validateFileEdit };
