import { prisma } from "../db.config.js";

// 가게 추가
// 가게 데이터 삽입
export const addStore = async (data) => {
    const region = await prisma.region.findFirst({ where: { id: data.regionId } });
    if (!region) {
        return null;
    }
    const created = await prisma.store.create({ data: data });
    return created.id;
};

// 가게 정보 얻기
export const getStore = async (storeId) => {
    const store = await prisma.store.findFirstOrThrow({ where: { id: storeId } });
    return store;
};

// 가게 지역 반환
export const getRegionByRegionId = async (regionId) => {
    const region = await prisma.region.findFirstOrThrow({ where: { id: regionId } });
    return region;
};

// 가게 리뷰 추가
// 리뷰 데이터 삽입
export const addStoreReview = async (data) => {
    const store = await prisma.store.findFirst({ where: { id: data.storeId } });
    if (!store) {
        return { idError: true };
    }
    const created = await prisma.review.create({ data: data });
    return created.id;
};

// 리뷰 정보 얻기
export const getStoreReview = async (reviewId) => {
    const review = await prisma.review.findFirstOrThrow({ where: { id: reviewId } });
    return review;
};

// 리뷰 이미지 매핑
export const setStoreReviewImage = async (reviewId, imageUrl) => {
    await prisma.reviewImage.create({
        data: {
            reviewId: reviewId,
            imageUrl: imageUrl
        },
    });
};

// 리뷰 이미지 반환
export const getStoreReviewImageByReviewId = async (reviewId) => {
    const reviewImages = await prisma.reviewImage.findMany({
        select: {
            id: true,
            reviewId: true,
            review: true,
            imageUrl: true
        },
        where: { reviewId: reviewId },
        orderBy: { reviewId: "asc" },
    });

    return reviewImages;
};

// 가게 미션 추가
// 가게 미션 데이터 삽입
export const addStoreMission = async (data) => {
    const store = await prisma.store.findFirst({ where: { id: data.storeId } });
    if (!store) {
        return null;
    }
    const created = await prisma.mission.create({ data: data });
    return created.id;
};

// 가게 미션 정보 얻기
export const getStoreMission = async (missionId) => {
    const mission = await prisma.mission.findFirstOrThrow({ where: { id: missionId } });
    return mission;
};

// 가게 미션 도전 중인 미션에 추가
// 가게 미션 도전 데이터 삽입
export const addStoreMissionChallenge = async (data) => {
    const mission = await prisma.member.findFirst({ where: { id: data.missionId } });
    const memMission = await prisma.memberMission.findFirst({
        where: {
            missionId: data.missionId,
            memberId: data.memberId
        }
    });
    if (!mission) {
        return { idError: true };
    }
    if (memMission) {
        return { isChallenge: true };
    }
    const created = await prisma.memberMission.create({ data: data });
    return created.id;
};

// 가게 미션 도전 정보 얻기
export const getStoreMissionChallenge = async (missionChallengeId) => {
    const memMission = await prisma.memberMission.findFirstOrThrow({ where: { id: missionChallengeId } });
    return memMission;
};

// 가게 리뷰 불러오기
export const getAllStoreReviews = async (storeId, cursor) => {
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
        where: { storeId: storeId, id: { gt: cursor } },
        orderBy: { id: "asc" },
        take: 5,
    });
    if (!reviews[0]) {
        const store = await prisma.store.findFirst({ where: { id: storeId } });
        if (!store) {
            return { idError: true }
        }
        return { exceedCursor: true };
    }
    return reviews;
};

// 가게 미션 불러오기
export const getAllStoreMissions = async (storeId, cursor) => {
    const missions = await prisma.mission.findMany({
        select: {
            id: true,
            store: true,
            storeId: true,
            reward: true,
            deadline: true,
            missionSpec: true,
        },
        where: { storeId: storeId, id: { gt: cursor } },
        orderBy: { id: "asc" },
        take: 5,
    });
    if (!missions[0]) {
        const store = await prisma.store.findFirst({ where: { id: storeId } });
        if (!store) {
            return { idError: true }
        }
        return { exceedCursor: true };
    }
    return missions;
};