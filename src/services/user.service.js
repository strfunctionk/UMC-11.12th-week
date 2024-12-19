import {
    responseFromUser,
    responseFromUserAgree,
    responseFromReviews,
    responseFromMissions,
} from "../dtos/user.dto.js";;
import {
    DuplicateUserEmailError,
    DuplicateMissionError,
    NotExistId,
    ExceededCursorValue
} from "../errors.js";
import {
    addUser,
    getUser,
    getUserPreferencesByUserId,
    setPreference,
    getUserAgree,
    setUserAgree,
    getAllUserReviews,
    getAllUserMissions,
    getMemberMissionId,
    patchUserMissionComplete,
    patchSocialUser
} from "../repositories/user.repository.js";

// 유저 회원가입
export const userSignUp = async (data) => {
    const joinUserId = await addUser({
        name: data.name,
        gender: data.gender,
        age: data.age,
        address: data.address,
        specAddress: data.specAddress,
        phoneNum: data.phoneNum,
        status: data.status,
        email: data.email,
        point: data.point,
    });

    if (joinUserId.sameEmail) {
        throw new DuplicateUserEmailError("이미 존재하는 이메일입니다.", data);
    }

    for (const preference of data.preferences) {
        const category = await setPreference(joinUserId, preference);
        if (category.idError === true) {
            throw new NotExistId("카테고리를 설정할 수 없습니다.", data);
        }
    }

    const user = await getUser(joinUserId);
    const preferences = await getUserPreferencesByUserId(joinUserId);

    return responseFromUser(
        {
            user,
            preferences
        });
};

// 유저 약관 동의
export const userAgreeAddition = async (data) => {

    for (const condition of data.terms) {
        const userAgree = await setUserAgree(data.user, condition);
        if (userAgree === null) {
            throw new NotExistId("약관을 설정하지 못합니다.", data)
        }
    }

    const userAgree = await getUserAgree(data.user.id);
    return responseFromUserAgree(
        {
            userAgree,
        });
};

// 내가 작성한 리뷰 목록 불러오기
export const listUserReviews = async (memberId, cursor) => {
    const reviews = await getAllUserReviews(memberId, cursor);
    if (reviews.idError === true) {
        throw new NotExistId("내가 작성한 리뷰에 대한 정보를 불러올 수 없습니다.", memberId);
    }
    else if (reviews.exceedCursor === true) {
        throw new ExceededCursorValue("커서 값이 초과되었습니다.", cursor);
    }
    return responseFromReviews(reviews);
};

// 내가 진행 중인 미션 목록 불러오기
export const listUserMissions = async (memberId, status, cursor) => {
    const missions = await getAllUserMissions(memberId, status, cursor);
    if (missions.idError === true) {
        throw new NotExistId(`내가 ${status}인 미션에 대한 정보를 불러올 수 없습니다.`, memberId);
    }
    else if (missions.exceedCursor === true) {
        throw new ExceededCursorValue("커서 값이 초과되었습니다.", cursor);
    }
    return responseFromMissions(missions);
};

// 내가 진행 중인 미션을 진행 완료로 바꾸기
export const CompleteUserMission = async (data, memberId, missionId) => {
    const memberMissionId = await getMemberMissionId(memberId, missionId, data.status)
    if (memberMissionId.statusError === true) {
        throw new DuplicateMissionError("요청한 상태가 이미 되어있는 미션입니다.", data);
    }
    if (memberMissionId.idError === true) {
        throw new NotExistId("멤버 미션을 찾을 수 없습니다.", data);
    }
    const missionComplete = await patchUserMissionComplete(data.status, memberMissionId);
    return responseFromMissions({
        missionComplete
    });
};

export const userSocialSignUp = async (data) => {
    await patchSocialUser(data);

    for (const preference of data.preferences) {
        const category = await setPreference(data.id, preference);
        if (category.idError === true) {
            throw new NotExistId("카테고리를 설정할 수 없습니다.", data);
        }
    }

    const user = await getUser(data.id);
    const preferences = await getUserPreferencesByUserId(data.id);

    console.log(user);
    return responseFromUser(
        {
            user,
            preferences
        });
};