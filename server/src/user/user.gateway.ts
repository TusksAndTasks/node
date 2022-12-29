import { WebSocketGateway, SubscribeMessage, MessageBody, OnGatewayDisconnect, OnGatewayConnection, WebSocketServer } from '@nestjs/websockets';
import { UserService } from './user.service';
import {Server, Socket} from "socket.io";

@WebSocketGateway({cors: true})
export class UserGateway implements OnGatewayDisconnect, OnGatewayConnection {
  constructor(private readonly userService: UserService) {}
  @WebSocketServer()
  io: Server;
  isUserLogged = false;
  socket = null

  @SubscribeMessage('connection')
  async handleConnection(socket: Socket){
   this.socket = socket
  }

  @SubscribeMessage('login')
  async login(@MessageBody() username: string ) {
  console.log(this.socket.id, username)
  await this.userService.loginUser(username, this.socket)
  this.isUserLogged = true
  }

  @SubscribeMessage('getUserList')
  async getUserList() {
    const users = await this.userService.getUsers();
    console.log(users);
    this.io.sockets.emit('sendUserList', users);
  }

  @SubscribeMessage('disconnect')
  async handleDisconnect(socket: Socket) {
    if (this.isUserLogged) {
      await this.userService.disconnect(socket.id)
      this.io.sockets.emit('logoff');
      this.isUserLogged = false;
    }
  }

}
