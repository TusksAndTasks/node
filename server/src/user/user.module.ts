import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserGateway } from './user.gateway';
import {TypeOrmModule} from "@nestjs/typeorm";
import {User} from "./entities/user.entity";
import {Server} from "socket.io";

@Module({
  imports: [TypeOrmModule.forFeature([User])],
  providers: [UserGateway, UserService, Server]
})
export class UserModule {}
