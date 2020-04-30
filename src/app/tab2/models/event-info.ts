import { Organizer } from './organizer';

export class EventInfo {
    id: number;
    organizer: Organizer;
    description: string;
    pic: string;
    place: string;
    date: Date;
    numOfParticipants: number;
}