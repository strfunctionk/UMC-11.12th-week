import { prisma } from "../db.config.js";

// 유저 회원가입
// User 데이터 삽입
export const addUser = async (data) => {
    const member = await prisma.member.findFirst({ where: { email: data.email } });
    if (member) {
        return { sameEmail: true };
    }

    const created = await prisma.member.create({ data: data });
    return created.id;
};


// 사용자 정보 얻기
export const getUser = async (memberId) => {
    const member = await prisma.member.findFirstOrThrow({ where: { id: memberId } });
    return member;
};

// 음식 선호 카테고리 매핑
export const setPreference = async (memberId, categoryId) => {
    const category = await prisma.category.findFirst({ where: { id: categoryId } });
    if (!category) {
        return { idError: true }
    }
    await prisma.memberPrefer.create({
        data: {
            memberId: memberId,
            categoryId: categoryId,
        },
    });
    return { idError: false }
};

// 사용자 선호 카테고리 반환
export const getUserPreferencesByUserId = async (memberId) => {
    const preferences = await prisma.memberPrefer.findMany({
        select: {
            id: true,
            memberId: true,
            categoryId: true,
            category: true,
        },
        where: { memberId: memberId },
        orderBy: { categoryId: "asc" },
    });

    return preferences;
};

// 유저 약관 동의
// 약관 동의 매핑
export const setUserAgree = async (user, termsId) => {
    const terms = await prisma.terms.findFirst({ where: { id: termsId } });
    if (!terms) {
        return null;
    }
    await prisma.memberAgree.create({
        data: {
            memberId: user.id,
            termsId: termsId,
        },
    });
};

// 약관 동의 반환
export const getUserAgree = async (memberId) => {
    const memberAgree = await prisma.memberAgree.findFirstOrThrow({ where: { id: memberId } });
    return memberAgree;
};

// 내가 작성한 리뷰 목록 불러오기
export const getAllUserReviews = async (memberId, cursor) => {
    const reviews = await prisma.review.findMany({
        select: {
            id: true,
            body: true,
            score: true,
            storeId: true,
            memberId: true,
            store: true,
            member: true,
        },
        where: { memberId: memberId, id: { gt: cursor } },
        orderBy: { id: "asc" },
        take: 5,
    });
    if (!reviews[0]) {
        return { exceedCursor: true };
    }
    return reviews;
};

// 내가 진행 중인 미션 목록 불러오기
export const getAllUserMissions = async (memberId, status, cursor) => {
    const missions = await prisma.memberMission.findMany({
        select: {
            id: true,
            member: true,
            memberId: true,
            mission: true,
            missionId: true,
            status: true,
        },
        where: { memberId: memberId, status: status, id: { gt: cursor } },
        orderBy: { id: "asc" },
        take: 5,
    });
    if (!missions[0]) {
        return { exceedCursor: true };
    }
    return missions;
};

// 내가 진행 중인 미션을 진행 완료로 바꾸기
// 유저미션id 반환
export const getMemberMissionId = async (memberId, missionId, status) => {
    const memberMission = await prisma.memberMission.findFirst({
        where: {
            memberId: memberId,
            missionId: missionId
        }
    });

    if (!memberMission) {
        return { idError: true };
    }
    else if (memberMission.status === status) {
        return { statusError: true }
    }
    return memberMission.id;
}
// 진행완료로 변경
export const patchUserMissionComplete = async (status, id) => {
    const missionComplete = await prisma.memberMission.update({
        where: {
            id: id
        },
        data: {
            status: status
        }
    });
    return missionComplete;
}

export const patchSocialUser = async (data) => {
    await prisma.member.update({
        where: {
            id: data.id
        },
        data: {
            name: data.name,
            gender: data.gender,
            age: data.age,
            address: data.address,
            specAddress: data.specAddress,
            phoneNum: data.phoneNum,
            status: data.status,
            email: data.email,
            socialType: data.socialType,
            point: data.point,
        }
    });
}