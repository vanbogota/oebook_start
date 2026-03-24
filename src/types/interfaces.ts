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
    email: string;
    library: string;
    country: string;
    isProfileComplete: boolean;
    createdAt: Date;
    updatedAt: Date;
}
