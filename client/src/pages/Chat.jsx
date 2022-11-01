import React, {useEffect, useState} from "react";

function Chat({socket, username, chatRoom}){
    const [chatHistory, setChatHistory] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');

    useEffect(() => {
        socket.on('sendChatHistory', (history) => {
            setChatHistory(history)
        });
        socket.on('receiveMessage', (message) => {
            setChatHistory((history) => [...history, message]);
        })
    }, [])

    const messages = chatHistory.map((message) => (
        <div key={message.content + message.time}>
            <p>{message.content}</p>
            <p>{message.author}</p>
            <p>{message.time}</p>
        </div>
    ))

    const sendMessage = async () => {
        const message = {
            content: currentMessage,
            author: username,
            time: new Date(Date.now()).getHours() +
                ":" +
                new Date(Date.now()).getMinutes(),
            room: chatRoom
        }

       await socket.emit('sendMessage', message);
       setCurrentMessage('');
    }

    return (
        <div>
            {messages}
            <input type='text' placeholder='enter message' onChange={(event) => setCurrentMessage(event.target.value)}/>
            <button onClick={(e) => {
                e.preventDefault();
                sendMessage();
            }}>Submit</button>
        </div>
    )
}

export default React.memo(Chat);