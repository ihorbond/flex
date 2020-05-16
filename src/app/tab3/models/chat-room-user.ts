export interface ChatRoomUser {
    [key: string]: {
        name: string;
        avatar: string;
        unreadMsgCount: number;
        isInTheRoom: boolean;
    }
}