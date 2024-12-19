import {
    responseFromStore,
    responseFromStoreReview,
    responseFromStoreMission,
    responseFromStoreMissionChallenge,
    responseFromReviews,
    responseFromMissions,
} from "../dtos/store.dto.js";;
import {
    AlreadyChallengingError,
    ExceededCursorValue,
    NotExistId
} from "../errors.js";
import {
    addStore,
    getStore,
    getRegionByRegionId,
    addStoreReview,
    getStoreReview,
    getStoreReviewImageByReviewId,
    setStoreReviewImage,
    addStoreMission,
    getStoreMission,
    addStoreMissionChallenge,
    getStoreMissionChallenge,
    getAllStoreReviews,
    getAllStoreMissions,
} from "../repositories/store.repository.js";

// 가게 추가
export const storeAddition = async (data) => {
    const storeId = await addStore({
        regionId: data.regionId,
        name: data.name,
        address: data.address,
        score: data.score,
    });
    if (storeId === null) {
        throw new NotExistId("지역이 존재하지 않습니다.", data);
    }
    const store = await getStore(storeId);
    const region = await getRegionByRegionId(data.regionId);

    return responseFromStore(
        {
            store,
            region
        });
};

// 가게 리뷰 추가
export const storeReviewAddition = async (data) => {
    const reviewId = await addStoreReview({
        memberId: data.user.id,
        storeId: data.storeId,
        body: data.body,
        score: data.score,
    });

    if (reviewId.idError === true) {
        throw new NotExistId("가게 혹은 유저가 존재하지 않습니다.", data);
    }

    for (const reviewImage of data.reviewImages) {
        await setStoreReviewImage(reviewId, reviewImage);
    }

    const review = await getStoreReview(reviewId);
    const reviewImages = await getStoreReviewImageByReviewId(reviewId);

    return responseFromStoreReview(
        {
            review,
            reviewImages,
        });
};

// 가게 미션 추가
export const storeMissionAddition = async (data) => {
    const missionId = await addStoreMission({
        storeId: data.storeId,
        reward: data.reward,
        deadline: data.deadline,
        missionSpec: data.missionSpec,
    });
    if (missionId === null) {
        throw new NotExistId("가게가 존재하지 않습니다.", data);
    }
    const mission = await getStoreMission(missionId);

    return responseFromStoreMission(
        {
            mission,
        });
};

// 가게 미션 도전 중인 미션에 추가
export const storeMissionChallengeAddition = async (data) => {
    const memMissionId = await addStoreMissionChallenge({
        memberId: data.user.id,
        missionId: data.missionId,
        status: data.status,
    });

    if (memMissionId.idError === true) {
        throw new NotExistId("미션 혹은 유저를 찾을 수 없습니다.", data);
    }
    else if (memMissionId.isChallenge === true) {
        throw new AlreadyChallengingError("이미 도전 중입니다.", data);
    }

    const missionChallenge = await getStoreMissionChallenge(memMissionId);

    return responseFromStoreMissionChallenge(
        {
            missionChallenge,
        });
};

// 가게 리뷰 불러오기
export const listStoreReviews = async (storeId, cursor) => {
    const reviews = await getAllStoreReviews(storeId, cursor);
    if (reviews.idError === true) {
        throw new NotExistId("가게 리뷰에 대한 정보를 불러올 수 없습니다.", storeId);
    }
    else if (reviews.exceedCursor === true) {
        throw new ExceededCursorValue("커서 값이 초과되었습니다.", cursor);
    }
    return responseFromReviews(reviews);
};

// 가게 미션 불러오기
export const listStoreMissions = async (storeId, cursor) => {
    const missions = await getAllStoreMissions(storeId, cursor);
    if (missions.idError === true) {
        throw new NotExistId("가게 미션에 대한 정보를 불러올 수 없습니다.", storeId);
    }
    else if (missions.exceedCursor === true) {
        throw new ExceededCursorValue("커서 값이 초과되었습니다.", cursor);
    }
    return responseFromMissions(missions);
};