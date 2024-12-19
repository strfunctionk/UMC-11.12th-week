// 가게 추가
export const bodyToStore = (body) => {

    return {
        regionId: body.regionId,
        name: body.name,
        address: body.address,
        score: body.score,
    };
};

export const responseFromStore = ({ store, region }) => {
    return {
        name: store.name,
        address: store.address,
        score: store.score,
        region: region.name
    };
};

// 가게 리뷰 추가
export const bodyToStoreReview = (user, body) => {

    return {
        user: user,
        storeId: body.storeId,
        body: body.body,
        score: body.score,
        reviewImages: body.reviewImages,
    };
};

export const responseFromStoreReview = ({ review, reviewImages }) => {
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
export const bodyToStoreMission = (body) => {
    const deadline = new Date(body.deadline);
    return {
        storeId: body.storeId,
        reward: body.reward,
        deadline,
        missionSpec: body.missionSpec,
    };
};

export const responseFromStoreMission = ({ mission }) => {
    return {
        reward: mission.reward,
        deadline: mission.deadline,
        missionSpec: mission.missionSpec
    };
};

// 가게 미션 도전 중인 미션에 추가
export const bodyToStoreMissionChallenge = (user, body) => {
    return {
        user: user,
        missionId: body.missionId,
        status: body.status,
    };
};

export const responseFromStoreMissionChallenge = ({ missionChallenge }) => {
    return {
        status: missionChallenge.status,
    };
};

// 가게 리뷰 불러오기
export const responseFromReviews = (reviews) => {
    return {
        data: reviews,
        pagination: {
            cursor: reviews.length ? reviews[reviews.length - 1].id : null,
        },
    };
};

// 가게 미션 불러오기
export const responseFromMissions = (missions) => {
    return {
        data: missions,
        pagination: {
            cursor: missions.length ? missions[missions.length - 1].id : null,
        },
    };
};