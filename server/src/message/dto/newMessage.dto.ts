export class NewMessageDto {
    content: string;
    author: string;
    time: string;
    responseId: number | null;
    room: string
}
