import { Injectable } from '@nestjs/common';
import {InjectRepository} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Repository} from "typeorm";
import {Socket} from "socket.io";

@Injectable()
export class UserService {
  constructor(
      @InjectRepository(User)
      private usersRepository: Repository<User>,
  ) {
  }

 async loginUser(username: string, socket: Socket) {
   const user =  await this.usersRepository.findOneBy({name: username});

   if(user){
     await this.usersRepository.update(user, { online: true, latestId: socket.id } )
   } else {
     await this.usersRepository.save({ name: username, online: true, latestId: socket.id })
   }
  }

 async getUsers() {
   const userList = await this.usersRepository.find({});
   return userList
  }

  async disconnect(id: string){
      const user = await this.usersRepository.findOneBy({latestId: id});
      await this.usersRepository.update(user!, {online: false});
  }
}
