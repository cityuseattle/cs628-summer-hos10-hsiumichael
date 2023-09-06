import express from "express";
import cors from "cors";
import "./loadEnvironment.mjs";
import records from "./routes/record.mjs";

import session from "express-session";
import passport from 'passport';
import passportFacebook from 'passport-facebook';
const FacebookStrategy = passportFacebook.Strategy;

// const FACEBOOK_APP_ID = ;
// const FACEBOOK_APP_SECRET = ;

passport.use(
    new FacebookStrategy (
        {
            clientID: FACEBOOK_APP_ID,
            clientSecret: FACEBOOK_APP_SECRET,
            callbackURL: 'https://ominous-journey-7jrvqrj4g55hrg4j-5050.app.github.dev/facebook/callback',
            profileFields: ['id', 'displayName', 'email'],
        },
        async (accessToken, refreshToken, profile, done) => {
            return done(null, profile);
        }
    )
);

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(obj, done) {
    done(null, obj);
});

const PORT = process.env.PORT || 5050;
const app = express();

app.use(cors());
app.use(express.json());

app.use("/record", records);

app.use(session({ secret: 'secret-key', resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());

app.get('/facebook', passport.authenticate('facebook'));
app.get('/facebook/callback', passport.authenticate('facebook', {
    successRedirect: 'https://ominous-journey-7jrvqrj4g55hrg4j-3000.app.github.dev/home',
    failureRedirect: 'https://ominous-journey-7jrvqrj4g55hrg4j-3000.app.github.dev',
}))

app.listen(PORT, () => {
    console.log(`Server is running on port: ${PORT}`);
});