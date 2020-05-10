export interface User {
    id: string;
    firstName: string;
    lastName: string;
    description: string;
    dob: Date;
    lastSeenOn: Date;
    registeredOn: Date;
    photos: string[];
    avatar: string;
    events: string[];
}