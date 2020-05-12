import { ChatRoomUser } from './chat-room-user';

export interface ChatRoom {
    id: string;
    createdOn: Date;
    numOfMessages: number;
    preview: string;
    users: ChatRoomUser;
}

