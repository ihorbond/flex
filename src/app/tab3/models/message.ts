import { Timestamp } from '@firebase/firestore-types';

export interface ChatRoomMessage {
    id?: string;
    authorId: string;
    text: string;
    timestamp: Timestamp;
}