export interface Locker {
    id: string;
    name: string;
}

export interface PostDeliveryProvider {
    id: string;
    name: string;
}

export interface Library {
    id: string;
    name: string;
}

export interface UserProfile {
    uid: string;
    nickname: string;
    library: string;
    recoveryCode: string;
    createdAt: Date;
    updatedAt: Date;
}