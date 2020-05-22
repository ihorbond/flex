import { Timestamp } from '@firebase/firestore-types';

export interface Notification {
    id?: string;
    title: string;
    body: string;
    icon: string;
    navUrl: string;
    timestamp: Timestamp;
}