import dotenv from "dotenv";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as NaverStrategy } from "passport-naver-v2"
import { Strategy as KakaoStrategy } from "passport-kakao";
import { prisma } from "./db.config.js";

dotenv.config();

export const googleStrategy = new GoogleStrategy(
    {
        clientID: process.env.PASSPORT_GOOGLE_CLIENT_ID,
        clientSecret: process.env.PASSPORT_GOOGLE_CLIENT_SECRET,
        callbackURL: "http://localhost:3000/oauth2/callback/google",
        scope: ["email", "profile"],
        state: true,
    },
    (accessToken, refreshToken, profile, cb) => {
        return googleVerify(profile)
            .then((user) => cb(null, user))
            .catch((err) => cb(err));
    }
);

const googleVerify = async (profile) => {
    const email = profile.emails?.[0]?.value;
    if (!email) {
        throw new Error(`profile.email was not found: ${profile}`);
    }

    const member = await prisma.member.findFirst({ where: { email } });
    if (member !== null) {
        return { id: member.id, email: member.email, name: member.name, socialType: member.socialType, point: member.point };
    }

    const created = await prisma.member.create({
        data: {
            email,
            name: profile.displayName,
            gender: "추후 수정",
            age: 0,
            address: "추후 수정",
            specAddress: "추후 수정",
            phoneNum: "추후 수정",
            status: "추후 수정",
            socialType: "Google",
            point: 0,
        },
    });

    return { id: created.id, email: created.email, name: created.name, socialType: created.socialType, point: created.point };
};

export const naverStrategy = new NaverStrategy(
    {
        clientID: process.env.PASSPORT_NAVER_CLIENT_ID,
        clientSecret: process.env.PASSPORT_NAVER_CLIENT_SECRET,
        callbackURL: '/oauth2/callback/naver',
    },
    (accessToken, refreshToken, profile, done) => {
        return naverVerify(profile)
            .then((user) => done(null, user))
            .catch((err) => done(err));
    }
);

const naverVerify = async (profile) => {
    const email = profile.email;
    const gender = (profile.gender === "M") ? 'Male' : 'Female';
    const age = new Date().getFullYear() - profile.birthYear;
    if (!email) {
        throw new Error(`profile.email was not found: ${profile}`);
    }

    const member = await prisma.member.findFirst({ where: { email } });
    if (member !== null) {
        return { id: member.id, email: member.email, name: member.name, gender: member.gender, age: member.age, phoneNum: member.phoneNum, socialType: member.socialType, point: member.point };
    }
    const created = await prisma.member.create({

        data: {
            email,
            name: profile.name,
            gender,
            age,
            address: "추후 수정",
            specAddress: "추후 수정",
            phoneNum: profile.mobile,
            status: "추후 수정",
            socialType: "Naver",
            point: 0,
        },
    });

    return { id: created.id, email: created.email, name: created.name, gender: created.gender, age: created.age, phoneNum: created.phoneNum, socialType: created.socialType, point: created.point };
};

export const kakaoStrategy = new KakaoStrategy(
    {
        clientID: process.env.PASSPORT_KAKAO_CLIENT_ID,
        clientSecret: process.env.PASSPORT_KAKAO_CLIENT_SECRET,
        callbackURL: '/oauth2/callback/kakao',
    },
    (accessToken, refreshToken, profile, done) => {
        return kakaoVerify(profile)
            .then((user) => done(null, user))
            .catch((err) => done(err));
    }
);

const kakaoVerify = async (profile) => {
    const email = profile._json.kakao_account.email;
    if (!email) {
        throw new Error(`profile.email was not found: ${profile}`);
    }

    const member = await prisma.member.findFirst({ where: { email } });
    if (member !== null) {
        return { id: member.id, email: member.email, name: member.name, socialType: member.socialType, point: member.point };
    }
    const created = await prisma.member.create({

        data: {
            email,
            name: profile.username,
            gender: "추후 수정",
            age: 0,
            address: "추후 수정",
            specAddress: "추후 수정",
            phoneNum: "추후 수정",
            status: "추후 수정",
            socialType: "Kakao",
            point: 0,
        },
    });

    return { id: created.id, email: created.email, name: created.name, socialType: created.socialType, point: created.point };
}