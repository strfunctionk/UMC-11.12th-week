import swaggerAutogen from "swagger-autogen";
import swaggerUiExpress from "swagger-ui-express";
import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import {
    handleUserSignUp,
    handleUserAgreeAddition,
    handleListUserReviews,
    handleListUserMissions,
    handleUserMissionComplete,
    handleUserSocialSignUp,
} from "./controllers/user.controller.js";

import {
    handleStoreAddition,
    handleStoreReviewAddition,
    handleStoreMissionAddition,
    handleStoreMissionChallengeAddition,
    handleListStoreReviews,
    handleListStoreMissions
} from "./controllers/store.controller.js";

import { PrismaSessionStore } from "@quixo3/prisma-session-store";
import session from "express-session";
import passport from "passport";
import {
    googleStrategy,
    naverStrategy,
    kakaoStrategy
} from "./auth.config.js";
import { prisma } from "./db.config.js";

BigInt.prototype.toJSON = function () { // bigint 호환
    const int = Number.parseInt(this.toString());
    return int ?? this.toString();
};

dotenv.config();

passport.use(googleStrategy);
passport.use(naverStrategy);
passport.use(kakaoStrategy);
passport.serializeUser((user, done) => done(null, user));
passport.deserializeUser((user, done) => done(null, user));

const app = express();
const port = process.env.PORT;



app.use(cors(
    // {
    //     origin: ['http://localhost:3000', 'http://example.com']
    // }
));
app.use(express.static("public"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(
    session({
        cookie: {
            maxAge: 7 * 24 * 60 * 60 * 1000, // ms
        },
        secret: process.env.EXPRESS_SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
        store: new PrismaSessionStore(prisma, {
            checkPeriod: 2 * 60 * 1000, // ms
            dbRecordIdIsSessionId: true,
            dbRecordIdFunction: undefined,
        }),
    })
);

app.use(passport.initialize());
app.use(passport.session());

app.use((req, res, next) => {
    res.success = (success) => {
        return res.json({ resultType: "SUCCESS", error: null, success });
    };
    res.error = ({ errorCode = "unknown", reason = null, data = null }) => {
        return res.json({
            resultType: "FAIL",
            error: { errorCode, reason, data },
            success: null,
        });
    };
    next();
});

app.use(
    "/docs",
    swaggerUiExpress.serve,
    swaggerUiExpress.setup({}, {
        swaggerOptions: {
            url: "/openapi.json",
        },
    })
);

app.get("/openapi.json", async (req, res, next) => {
    // #swagger.ignore = true
    const options = {
        openapi: "3.0.0",
        disableLogs: true,
        writeOutputFile: false,
    };
    const outputFile = "/dev/null"; // 파일 출력은 사용하지 않습니다.
    const routes = ["./src/index.js"];
    const doc = {
        info: {
            title: "UMC 7th",
            description: "UMC 7th Node.js 테스트 프로젝트입니다.",
        },
        host: "localhost:3000",
    };

    const result = await swaggerAutogen(options)(outputFile, routes, doc);
    res.json(result ? result.data : null);
});

app.get("/oauth2/login/google", passport.authenticate("google"));
app.get(
    "/oauth2/callback/google",
    passport.authenticate("google", {
        failureRedirect: "/oauth2/login/google",
        failureMessage: true,
    }),
    (req, res) => res.redirect("/")
);

app.get("/oauth2/login/naver", passport.authenticate('naver', { authType: 'reprompt' }));
app.get(
    "/oauth2/callback/naver",
    passport.authenticate("naver", {
        failureRedirect: "/oauth2/login/naver",
        failureMessage: true,
    }),
    (req, res) => res.redirect("/")
);

app.get("/oauth2/login/kakao", passport.authenticate('kakao', { authType: 'reprompt' }));
app.get(
    "/oauth2/callback/kakao",
    passport.authenticate("kakao", {
        failureRedirect: "/oauth2/login/kakao",
        failureMessage: true,
    }),
    (req, res) => res.redirect("/")
);

app.get("/", (req, res) => {

    console.log(req.user);
    res.send(req.user);
});

//app.post("/api/v1/users/signup", handleUserSignUp);
app.post("/api/v1/users/terms", handleUserAgreeAddition)

app.post("/api/v1/stores/", handleStoreAddition);
app.post("/api/v1/stores/reviews", handleStoreReviewAddition);
app.post("/api/v1/stores/missions", handleStoreMissionAddition);
app.post("/api/v1/stores/missions/challenges", handleStoreMissionChallengeAddition);
app.post("/api/v1/users/social", handleUserSocialSignUp);

app.get("/api/v1/stores/:storeId/reviews", handleListStoreReviews);
app.get("/api/v1/stores/:storeId/missions", handleListStoreMissions);

app.get("/api/v1/users/stores/reviews", handleListUserReviews);
app.get("/api/v1/users/missions", handleListUserMissions);

app.patch("/api/v1/users/missions/:missionId/complete", handleUserMissionComplete);



app.use((err, req, res, next) => {
    if (res.headersSent) {
        return next(err);
    }

    res.status(err.statusCode || 500).error({
        errorCode: err.errorCode || "unknown",
        reason: err.reason || err.message || null,
        data: err.data || null,
    });
});

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});