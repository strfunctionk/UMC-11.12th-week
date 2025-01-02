import { Category, Member, MemberAgree, MemberMission, MemberPrefer, Mission, Region, Review, ReviewImage, Terms, Store } from "@prisma/client";
// 가게 추가
export const bodyToStore = (body: any) => {

    return {
        regionId: body.regionId,
        name: body.name,
        address: body.address,
        score: body.score,
    };
};

export const responseFromStore = ({
    store,
    region
}: {
    store: Store;
    region: Region;
}) => {
    return {
        name: store.name,
        address: store.address,
        score: store.score,
        region: region.name
    };
};

// 가게 리뷰 추가
export const bodyToStoreReview = (user: any, body: any) => {

    return {
        user: user,
        storeId: body.storeId,
        body: body.body,
        score: body.score,
        reviewImages: body.reviewImages,
    };
};

export const responseFromStoreReview = ({
    review,
    reviewImages
}: {
    review: Review;
    reviewImages: ReviewImage[]
}) => {
    const imageUrls = reviewImages.map(
        (image) => image.imageUrl
    );
    return {
        body: review.body,
        score: review.score,
        imageUrl: imageUrls
    };
};

// 가게 미션 추가
export const bodyToStoreMission = (body: any) => {
    const deadline = new Date(body.deadline);
    return {
        storeId: body.storeId,
        reward: body.reward,
        deadline,
        missionSpec: body.missionSpec,
    };
};

export const responseFromStoreMission = ({
    mission
}: {
    mission: Mission
}) => {
    return {
        reward: mission.reward,
        deadline: mission.deadline,
        missionSpec: mission.missionSpec
    };
};

// 가게 미션 도전 중인 미션에 추가
export const bodyToStoreMissionChallenge = (user: any, body: any) => {
    return {
        user: user,
        missionId: body.missionId,
        status: body.status,
    };
};

export const responseFromStoreMissionChallenge = ({
    missionChallenge
}: {
    missionChallenge: MemberMission
}) => {
    return {
        status: missionChallenge.status,
    };
};

// 가게 리뷰 불러오기
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

// 가게 미션 불러오기
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