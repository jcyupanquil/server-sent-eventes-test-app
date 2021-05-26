import { Message } from "@angular/compiler/src/i18n/i18n_ast";
import { Participant } from "./participant.model";

export class Conversation {
    id: string;
    participants: Participant[];
    createdAt: Date;
    messages: Message[];
}