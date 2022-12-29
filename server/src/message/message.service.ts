import { Injectable } from '@nestjs/common';
import { NewMessageDto } from './dto/newMessage.dto';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {Repository} from "typeorm";
import {Message} from "./entities/message.entity";

@Injectable()
export class MessageService {
  constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
      @InjectRepository(Message)
      private messageRepository: Repository<Message>
  ) {

  }

 async setNullMessage() {
    const responseMessage = await this.messageRepository.findOneBy({id: 1})
    if(!responseMessage){
      const nullMessage = new Message();
      nullMessage.content = ''
      nullMessage.time = ''
      nullMessage.room = ''
      await this.messageRepository.save(nullMessage)
    }
  }

 async getChatHistory(roomName: string) {
    const history = await this.messageRepository.findBy({room: roomName});
    const parsedHistory = history.map(({id, content, time, room, author, responseToId}) => ({
      id,
      content,
      time,
      room,
      author: author.name,
      responseToId
    }))

    return parsedHistory
  }

 async saveMessage(message: NewMessageDto){
   const user =  await this.usersRepository.findOneBy({name: message.author});
   const responseMessage = await this.messageRepository.findOneBy({id: message.responseId ? message.responseId : 1})

   const roomMessage = new Message();
   roomMessage.room = message.room;
   roomMessage.content = message.content;
   roomMessage.time = message.time;
   roomMessage.author = user!
   roomMessage.responseTo = responseMessage!

   return await this.messageRepository.save(roomMessage);
 }
}
