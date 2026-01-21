import 'dotenv/config';

import path from 'path';
import express from 'express';
import session from 'express-session';
import { prisma } from './lib/prisma';
import { PrismaSessionStore } from '@quixo3/prisma-session-store';
import passport from 'passport';

import './auth/passportConfig';
import './cloudinary/cloudinaryConfig';

import indexRouter from './routes/indexRouter';
import folderRouter from './routes/folderRouter';
import shareRouter from './routes/shareRouter';

import { renderError404 } from './controllers/utilities/errorsUtilities';

const __dirname = import.meta.dirname;

const app = express();

const assetsPath = path.join(__dirname, 'public');
app.use(express.static(assetsPath));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

const cookieSecret = process.env.COOKIE_SECRET;

if (cookieSecret === undefined) {
    throw new Error('ERROR: COOKIE_SECRET is not defined in .env');
}

app.use(
    session({
        store: new PrismaSessionStore(prisma, {
            checkPeriod: 2 * 60 * 1000, //ms
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }),
        secret: cookieSecret,
        resave: false,
        saveUninitialized: true,
        cookie: { maxAge: 1 * 24 * 60 * 60 * 1000 },
    }),
);

app.use(passport.session());

app.use('/', indexRouter);
app.use('/folder', folderRouter);
app.use('/share', shareRouter);

// Error middleware
app.use('/', (req, res) => {
    return renderError404(res);
});

const appPort = process.env.PORT || 8080;

app.listen(appPort, (error) => {
    if (error) {
        throw error;
    }
    console.log('App running and listening on port: ', appPort);
});
