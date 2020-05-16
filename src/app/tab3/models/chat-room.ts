import { ChatRoomUser } from './chat-room-user';
import { Timestamp } from '@firebase/firestore-types';
import { ChatRoomMessage } from './message';

export interface ChatRoom {
    id?: string;
    createdAt: Timestamp;
    updatedAt?: Timestamp;
    msgCount: number;
    userIds: string[];
    users: ChatRoomUser;
    lastMessage: ChatRoomMessage;
}

