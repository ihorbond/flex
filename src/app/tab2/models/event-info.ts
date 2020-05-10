import { Organizer } from './organizer';
import { Timestamp } from '@firebase/firestore-types';

export class EventInfo {
    id: string;
    title: string;
    organizer: Organizer;
    description: string;
    imageURL: string;
    location: Location;
    date: Timestamp;
    particapants: number;
}
