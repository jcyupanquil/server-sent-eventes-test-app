import { Participant } from "./participant.model";

export class Message {

    constructor() {
        this.sender = new Participant();
    }

    content: string = '';
    createdAt: Date;
    type: string;
    sender: Participant;
}
