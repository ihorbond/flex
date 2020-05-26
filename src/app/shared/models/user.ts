import { Timestamp } from '@firebase/firestore-types';

export interface User {
    id?: string;
    firstName: string;
    lastName: string;
    description: string;
    dob: Timestamp;
    email: string;
    phoneNumber: string;
    signInProviderId: string;
    lastSignIn: Timestamp;
    createdAt: Timestamp;
    updatedAt: Timestamp;
    photos: UserPhoto[];
    avatar: UserPhoto;
    events: string[];
    devices: UserDevice[];
}

export interface UserPhoto {
    name: string;
    url: string;
}

export interface UserDevice {
    id?: string;
    manufacturer: string,
    model: string,
    version: string,
    uuid: string,
    token: string;
}