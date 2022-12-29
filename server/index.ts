import {User} from "./entity/user";

const express = require('express');
const { Server } = require("socket.io");
const { createServer } = require("http");
import {createConnection} from "typeorm";
import {Message} from "./entity/message";
import {Socket} from "socket.io";

createConnection().then((connection) => {

    const app = express();
    const httpServer = createServer(app);
    const io = new Server(httpServer, {
        cors: {
            origin: "http://localhost:3000",
            methods: ["GET", "POST"],
        }
    });

    let isUserLogged = false;

    io.on('connection', async (socket: Socket) => {

        const chatHistory = connection.getRepository(Message);
        const responseMessage = await chatHistory.findOneBy({id: 1})
        if(!responseMessage){
           const nullMessage = new Message();
           nullMessage.content = ''
           nullMessage.time = ''
           nullMessage.room = ''
           await chatHistory.save(nullMessage)
        }

        socket.on('login', async (username: string) => {

            const users = connection.getRepository(User);
            const user =  await users.findOneBy({name: username});

            if(user){
                await users.update(user, { online: true, latestId: socket.id } )
            } else {
                await users.save({ name: username, online: true, latestId: socket.id })
            }

            isUserLogged = true;

        })

        socket.on('getUserList', async () => {
            const users = connection.getRepository(User);
            const parsedUserList =  await users.find({});
            console.log(parsedUserList)

            io.sockets.emit('sendUserList', parsedUserList);

        })

        socket.on('joinRoom', async (roomName: string) => {

            socket.join(roomName);
            const chatHistory = connection.getRepository(Message);
            const history = await chatHistory.findBy({room: roomName});
            const parsedHistory = history.map(({id, content, time, room, author, responseToId}) => ({
                id,
                content,
                time,
                room,
                author: author.name,
                responseToId
            }))

            io.sockets.to(roomName).emit('sendChatHistory', parsedHistory);

        })

        socket.on('changeRoom', (roomName: string) => {
            socket.leave(roomName)
        })

        socket.on('sendMessage', async (message: {content: string, author: string, time: string, responseId: number | null, room: string}) => {

            const users = connection.getRepository(User);
            const user =  await users.findOneBy({name: message.author});

            const chatHistory = connection.getRepository(Message);
            const responseMessage = await chatHistory.findOneBy({id: message.responseId ? message.responseId : 1})

            const roomMessage = new Message();
            roomMessage.room = message.room;
            roomMessage.content = message.content;
            roomMessage.time = message.time;
            roomMessage.author = user!
            roomMessage.responseTo = responseMessage!

            const {id, content, time, room, author, responseToId} = await chatHistory.save(roomMessage);
            io.sockets.to(message.room).emit('receiveMessage', {
                id,
                content,
                time,
                room,
                author: author.name,
                responseToId
            })

        })

        socket.on('disconnect', async () => {
            if (isUserLogged) {
                const users = connection.getRepository(User)
                const user = await users.findOneBy({latestId: socket.id});
                await users.update(user!, {online: false});
                io.sockets.emit('logoff');
                isUserLogged = false;
            }

        })

    })

    httpServer.listen(3001, 511, () => {console.log('Running on 3000')});

})
