export interface ChatRoomUser {
    [key: string]: {
        name: string;
        avatar: string;
        hasUnread: boolean;
    }
}