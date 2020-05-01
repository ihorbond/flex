export class FeedPost {
    id: number; 
    userId: number;
    eventId: number;
    numOfFlexes: number = 0;
    numOfComments: number = 0;
    date: Date;
    description: string;
    pic: string;
    location: string;
}