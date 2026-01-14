import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import { validatePassword } from "./passwordUtils";
import { getUserByUsername, getUserById } from "../db/queries/indexQueriesSelect";

async function verifyCallback(username: string, password: string, done: any) {
    try {
        const user = await (getUserByUsername(username));
        
        if (user === null) {
            return done(null, false);
        }

        const passwordMatch = await validatePassword(password, user.password);

        if (passwordMatch) {
            return done(null, user);
        }

        return done(null, false);
    } catch (err) {
        return done(err);
    }
}

const strategy = new LocalStrategy(verifyCallback);

passport.use(strategy);

passport.serializeUser((user: any, done) => {
    done(null, user.userId);
});

passport.deserializeUser(async (userId: number, done) => {
    try {
        const user = await getUserById(userId);

        done(null, user);
    } catch (err) {
        done(err);
    }
});