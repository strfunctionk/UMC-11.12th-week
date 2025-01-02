export class NotExistId extends Error {
    errorCode = "U001";
    reason: string;
    data: string;
    constructor(reason: string, data: any) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

export class ExceededCursorValue extends Error {
    errorCode = "U002";
    reason: string;
    data: string;
    constructor(reason: string, data: any) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

export class DuplicateUserEmailError extends Error {
    errorCode = "U003";
    reason: string;
    data: string;
    constructor(reason: string, data: any) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

export class AlreadyChallengingError extends Error {
    errorCode = "U004";
    reason: string;
    data: string;
    constructor(reason: string, data: any) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

export class DuplicateMissionError extends Error {
    errorCode = "U005";
    reason: string;
    data: string;
    constructor(reason: string, data: any) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}

export class NotSocialError extends Error {
    errorCode = "U006";
    reason: string;
    data: string;
    constructor(reason: string, data: any) {
        super(reason);
        this.reason = reason;
        this.data = data;
    }
}