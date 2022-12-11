const express = require('express');
const { Server } = require("socket.io");
const { createServer } = require("http");
const fs = require('fs');
const fsPromises = require('fs/promises');
const path = require('path');
const {MongoClient} = require("mongodb");

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

const url = 'mongodb://localhost:27017';
const client = new MongoClient(url);

let isUserLogged = false;

io.on('connection', async (socket) => {

    await client.connect();
    const chatDB = client.db('chat');

    socket.on('login', async (username) => {

        const users = chatDB.collection('users');
        const user =  await users.findOne({name: username});

        if(user){
           await users.updateOne(user, { $set: { online: true, latestId: socket.id } })
        } else {
           await users.insertOne({ name: username, online: true, latestId: socket.id })
        }

        isUserLogged = true;

    })

    socket.on('getUserList', async () => {
        const users = chatDB.collection('users');
        const parsedUserList =  await users.find({}).toArray();

        io.sockets.emit('sendUserList', parsedUserList);

    })

    socket.on('joinRoom', async (roomName) => {

       socket.join(roomName);
       const chatHistory = chatDB.collection(roomName);
       const parsedHistory = await chatHistory.find({}).toArray();

       socket.emit('sendChatHistory', parsedHistory);

    })

    socket.on('changeRoom', (roomName) => {
        socket.leave(roomName)
    })

    socket.on('sendMessage', async (message) => {
        const chatHistory = chatDB.collection(message.room);
        await chatHistory.insertOne(message);
        socket.to(message.room).emit('receiveMessage', message)

    })

    socket.on('disconnect', async () => {
        if (isUserLogged) {
            const users = chatDB.collection('users');
            const user = await users.findOne({latestId: socket.id});
            await users.updateOne(user, {$set: {online: false}});
            io.sockets.emit('logoff');
            isUserLogged = false;
        }

    })

})

httpServer.listen(3001, 511, () => {console.log('Running on 3000')});