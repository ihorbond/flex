import { ChatRoomUser } from './chat-room-user';
import { Timestamp } from '@firebase/firestore-types';

export interface ChatRoom {
    id?: string;
    createdOn: Timestamp;
    numOfMessages: number;
    preview: string;
    users: ChatRoomUser;
}

