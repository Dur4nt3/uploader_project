import { body } from 'express-validator';
import { isUsernameUnique } from '../../db/queries/indexQueries';

const emptyErr = 'must not be empty';
const lengthErr = 'must be between 3 and 30 characters';
const passwordLengthErr = 'must be at least 8 characters long';
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

export { validateSignup };
