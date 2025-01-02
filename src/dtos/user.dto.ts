import { Category, Member, MemberAgree, MemberMission, MemberPrefer, Mission, Region, Review, ReviewImage, Terms } from "@prisma/client";
// 유저 회원 가입
export const bodyToUser = (body: any) => {

    return {
        name: body.name,
        gender: body.gender,
        age: body.age,
        address: body.address || "",
        specAddress: body.specAddress || "",
        phoneNum: body.phoneNum,
        status: body.status,
        email: body.email,
        point: body.point,
        preferences: body.preferences,
    };
};

export const responseFromUser = ({
    user,
    preferences
}: {
    user: Member;
    preferences: (MemberPrefer & { category: Category })[];
}) => {
    const preferFoods = preferences.map(
        (preference) => preference.category.name
    );
    return {
        email: user.email,
        name: user.name,
        preferCategory: preferFoods,
    };
};

// 유저 약관 동의
export const bodyToUserAgree = (user: any, body: any) => {

    return {
        user: user,
        terms: body.terms,
    };
};

export const responseFromUserAgree = ({
    userAgree
}: {
    userAgree: MemberAgree;
}) => {
    return {
        memberId: userAgree.memberId,
        termsId: userAgree.termsId
    };
};

// 내가 작성한 리뷰 목록 불러오기
export const responseFromReviews = ({
    reviews
}: {
    reviews: Review[]
}) => {
    return {
        data: reviews,
        pagination: {
            cursor: reviews.length ? reviews[reviews.length - 1].id : null,
        },
    };
};

// 내가 진행 중인 미션 목록 불러오기
export const responseFromMissions = ({
    missions
}: {
    missions: Mission[]
}) => {
    return {
        data: missions,
        pagination: {
            cursor: missions.length ? missions[missions.length - 1].id : null,
        },
    };
};

// 내가 진행 중인 미션을 진행 완료로 바꾸기
export const bodyToMissionComplete = (body: any) => {

    return {
        status: body.status,
    };
};
export const responseFromMissionComplete = ({
    missionComplete
}: {
    missionComplete: MemberMission
}) => {
    return {
        data: missionComplete,
    };
};

// 소셜 로그인 추가
export const bodyToSocial = (user: any, body: any) => {
    return {
        id: user.id || body.id,
        name: user.name || body.name,
        gender: user.gender || body.gender,
        age: user.age || body.age,
        address: user.address || body.address,
        specAddress: user.specAddress || body.specAddress,
        phoneNum: user.phoneNum || body.phoneNum,
        status: user.status || body.status,
        email: user.email || body.email,
        socialType: user.socialType || body.socialType,
        point: user.point,
        preferences: body.preferences,
    };
};