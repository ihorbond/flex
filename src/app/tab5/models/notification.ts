import { Timestamp } from '@firebase/firestore-types';

export interface Notification {
    id?: string;
    title: string;
    body: string;
    imageUrl: string;
    navUrl: string;
    timestamp: Timestamp;
}