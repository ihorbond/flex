import { Timestamp } from '@firebase/firestore-types';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    dob: Timestamp;
    lastSeenOn: Timestamp;
    registeredOn: Timestamp;
    photos: string[];
    avatar: string;
    events: string[];
}