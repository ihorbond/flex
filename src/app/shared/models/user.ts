export interface User {
    id: string;
    firstName: string;
    lastName: string;
    description: string;
    dob: Date;
    lastSeenOn: Date;
    registeredOn: Date;
    photos: UserPhoto[];
    avatar: string;
    events: string[];
    chatRoomIds: string[];
}

export interface UserPhoto {
    name: string;
    url: string;
}