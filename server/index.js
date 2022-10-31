const express = require('express');
const { Server } = require("socket.io");
const { createServer } = require("http");
const fs = require('fs');
const path = require('path');

const app = express();
const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "http://localhost:3000",
        methods: ["GET", "POST"],
    }
});

const readList = (callback) => {
    fs.readFile(path.join(__dirname, 'databases', 'userList.json'), (err, userList) => {
        if(err){
            console.error(err);
            return;
        }
        const parsedUserList = JSON.parse(userList.toString());
        callback(parsedUserList)
    })
};

let isUserLogged = false;

io.on('connection', (socket) => {

    socket.on('login', (username) => {
        const setUserOnline = (parsedUserList) => {
            const indexOfUser = parsedUserList.findIndex((element) => element.name === username);

            if(indexOfUser === -1){
                parsedUserList.push({name: username, online: true, latestId: socket.id})
            } else {
                parsedUserList[indexOfUser].online = true
                parsedUserList[indexOfUser].latestId = socket.id
            }

            fs.writeFile(path.join(__dirname, 'databases', 'userList.json'), JSON.stringify(parsedUserList), (err) => {
                console.error(err);
            });
        }

           readList(setUserOnline);
           isUserLogged = true;
    })

    socket.on('getUserList', () => {
            const sendUserList = (parsedUserList) => {
                io.sockets.emit('sendUserList', parsedUserList);
            }

            readList(sendUserList);
    })

    socket.on('disconnect', () => {
        const setUserOffline = (parsedUserList) => {
            const indexOfUser = parsedUserList.findIndex((element) => element.latestId === socket.id);
            parsedUserList[indexOfUser].online = false;
            fs.writeFile(path.join(__dirname, 'databases', 'userList.json'), JSON.stringify(parsedUserList), (err) => {
                console.error(err);
            });
        }
        if(isUserLogged){
            readList(setUserOffline);
            io.sockets.emit('logoff');
            isUserLogged = false;
        }

    })
})




httpServer.listen(3001, 511, () => {console.log('Running on 3000')});