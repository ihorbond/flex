import { DocumentReference } from '@firebase/firestore-types';
import { ChatRoom } from 'src/app/tab3/models/chat-room';

export interface User {
    id: string;
    firstName: string;
    lastName: string;
    description: string;
    dob: Date;
    lastSeenOn: Date;
    registeredOn: Date;
    photos: UserPhoto[];
    avatar: UserPhoto;
    events: string[];
    chatRooms: DocumentReference<ChatRoom>[];
    devices: UserDevice[];
}

export interface UserPhoto {
    name: string;
    url: string;
}

export interface UserDevice {
    id?: string;
    manufacturer: string,
    model: string,
    version: string,
    uuid: string,
    token: string;
}