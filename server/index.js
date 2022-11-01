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

const readFile = (path, callback) => {
    fs.readFile(path, (err, userList) => {
        if(err){
            console.error(err);
            return;
        }
        const parsedFile = JSON.parse(userList.toString());
        callback(parsedFile)
    })
};

let isUserLogged = false;
const pathToUserList = path.join(__dirname, 'databases', 'userList.json');

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

           readFile(pathToUserList, setUserOnline);
           isUserLogged = true;
    })

    socket.on('getUserList', () => {
            const sendUserList = (parsedUserList) => {
                io.sockets.emit('sendUserList', parsedUserList);
            }

            readFile(pathToUserList, sendUserList);
    })

    socket.on('joinRoom', (roomName) => {
        socket.join(roomName);
        const pathToChatHistory = path.join(__dirname, 'databases', 'chatHistories', `${roomName}.json`)

        if (!fs.existsSync(pathToChatHistory)){
            fs.writeFile(pathToChatHistory, JSON.stringify([]), () => {console.log('history created')});
        }
        const sendChatHistory = (parsedHistory) => {
            socket.emit('sendChatHistory', parsedHistory);
        }
        readFile(pathToChatHistory, sendChatHistory);

        console.log(roomName);
    })

    socket.on('sendMessage', (message) => {
        const pathToHistory = path.join(__dirname, 'databases', 'chatHistories', `${message.room}.json`)

        const updateHistory = (parsedHistory) => {
          const history = [...parsedHistory, message]
          fs.writeFile(pathToHistory, history, () => {console.log('History updated')} );
        }

        readFile(pathToUserList, updateHistory);
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
            readFile(pathToUserList, setUserOffline);
            io.sockets.emit('logoff');
            isUserLogged = false;
        }

    })
})




httpServer.listen(3001, 511, () => {console.log('Running on 3000')});