import { body } from 'express-validator';
import {
    isUsernameUnique,
    isUserFolderUnique,
    isValidVisibilityId,
    getFolderByUserIdAndName,
} from '../../db/queries/indexQueriesSelect';

const emptyErr = 'must not be empty';
const lengthErr = 'must be between 3 and 30 characters';
const passwordLengthErr = 'must be at least 8 characters long';
const descLengthErr = 'must be between 3 and 50 characters';
const alphaNumericErr = 'must only contain letters and numbers';

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

export { validateSignup, validateFolder };
