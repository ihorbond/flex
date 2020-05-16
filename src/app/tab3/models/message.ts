import { Timestamp } from '@firebase/firestore-types';

export interface ChatRoomMessage {
    id?: string;
    text: string;
    timestamp: Timestamp | Date
    authorId: string;
}