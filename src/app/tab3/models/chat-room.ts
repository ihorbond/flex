import { ChatRoomUser } from './char-room-user';

export interface ChatRoom {
    id: string;
    createdOn: Date;
    numOfMessages: number;
    preview: string;
    users: ChatRoomUser;
}

