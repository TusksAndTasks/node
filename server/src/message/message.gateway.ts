import {WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer} from '@nestjs/websockets';
import { MessageService } from './message.service';
import {Server, Socket} from "socket.io";
import {NewMessageDto} from "./dto/newMessage.dto";

@WebSocketGateway()
export class MessageGateway {
  constructor(private readonly messageService: MessageService) {}
  @WebSocketServer()
  io: Server;
  socket = null

  @SubscribeMessage('connection')
  async handleConnection(socket: Socket){
    this.socket = socket
    await this.messageService.setNullMessage()
  }

  @SubscribeMessage('joinRoom')
  async joinRoom(@MessageBody() roomName: string){
    this.socket.join(roomName)
    const chatHistory = await this.messageService.getChatHistory(roomName);
    this.io.sockets.to(roomName).emit('sendChatHistory', chatHistory);
  }

  @SubscribeMessage('changeRoom')
  async changeRoom(@MessageBody() roomName: string) {
    this.socket.leave(roomName)
  }

  @SubscribeMessage('sendMessage')
  async sendMessage(@MessageBody() message: NewMessageDto) {
    const { id, content, time, room, author, responseToId } = await this.messageService.saveMessage(message)
    this.io.sockets.to(message.room).emit('receiveMessage', {
      id,
      content,
      time,
      room,
      author: author.name,
      responseToId
    })
  }

}
