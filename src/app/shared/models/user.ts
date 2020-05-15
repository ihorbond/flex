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
}

export interface UserPhoto {
    name: string;
    url: string;
}