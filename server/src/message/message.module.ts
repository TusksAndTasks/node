import { Module } from '@nestjs/common';
import { MessageService } from './message.service';
import { MessageGateway } from './message.gateway';
import {Server} from "socket.io";
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "../user/entities/user.entity";
import {Message} from "./entities/message.entity";

@Module({
  imports: [TypeOrmModule.forFeature([User, Message])],
  providers: [MessageGateway, MessageService, Server]
})
export class MessageModule {}
