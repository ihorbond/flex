import { Organizer } from './organizer';

export class EventInfo {
    id: string;
    organizer: Organizer;
    description: string;
    imageURL: string;
    location: Location;
    // date: Timestamp;
    particapants: number;
}
