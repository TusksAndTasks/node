import React, {useEffect, useState} from "react";
import styled from "styled-components";
import ScrollToBottom from 'react-scroll-to-bottom';

function Chat({socket, username, chatRoom}){
    const [chatHistory, setChatHistory] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const [responseTo, setResponseTo] = useState(null)

    useEffect(() => {
        socket.on('sendChatHistory', (history) => {
            setChatHistory(history)
        });
    }, [chatRoom]);

    useEffect(() => {
        socket.on('receiveMessage', (message) => {
            setChatHistory((history) => [...history, message]);
        })
        return () => {
            socket.removeAllListeners('receiveMessage');
        }
    }, [socket])

    const messages = chatHistory.map((message) => (
        <React.Fragment key={message.id + message.content}>
            {chatHistory.find((msg) => msg.id === message.responseToId)?.content &&
            <ResponseToMessage sender={message.author === username}>
                {chatHistory.find((msg) => msg.id === message.responseToId)?.content}
            </ResponseToMessage>}
          <ChatMessage sender={message.author === username} resp={responseTo === message.id}  onClick={() => setResponseTo(message.id)}>
            <MessageText>{message.content}</MessageText>
            <MessageTime sender={message.author === username}>
                {message.time}
            </MessageTime>
          </ChatMessage>
        </React.Fragment>
    ))

    const sendMessage = async () => {
        if(currentMessage){
            const message = {
                content: currentMessage,
                author: username,
                time: new Date(Date.now()).getHours() +
                    ":" +
                    new Date(Date.now()).getMinutes(),
                room: chatRoom,
                responseId: responseTo
            }

            await socket.emit('sendMessage', message);
            setCurrentMessage('');
            setResponseTo(null);
        }
    }

    return ( chatRoom ?
    <ChatContainer>
        <ChatHeader>
            Чат с {chatRoom.split('-').filter((user) => user !== username).toString()}
        </ChatHeader>
        <ChatMessagesContainer>
            {messages}
        </ChatMessagesContainer>
        <ChatInputContainer>
            <MessageInput
                type='text'
                placeholder='Введите сообщение'
                value={currentMessage}
                onChange={(event) => setCurrentMessage(event.target.value)}
                onKeyPress={(event) => {
                    event.key === 'Enter' && sendMessage()
                }}
            />
            <SendButton onClick={sendMessage}>&#9658;</SendButton>
        </ChatInputContainer>
    </ChatContainer> : <ChatPlaceholder>Выберете пользователя, с которым хотите начать чат</ChatPlaceholder>
    )
}

export default React.memo(Chat);

const ChatContainer = styled.div`
   overflow-y: auto;
   width: 500px;
   background-color: transparent;
   border-radius: 20px;
`

const ChatMessagesContainer = styled(ScrollToBottom)`
 height: 500px;
  overflow-y: auto;
  background-color: white;
  
  & div[class*="react-scroll-to-bottom"]{
    display: flex;
    flex-flow: column;
  }
`

const ChatInputContainer = styled.div`
  width: 100%;
  overflow-x: hidden;
  box-shadow: 0px -1px 2px 1px rgba(0, 0, 0, .2);;
  height: 50px;
  position: relative;
`

const MessageInput = styled.input`
  font-family: "Roboto Light", sans-serif;
  width: calc(80% + 10px);
  border-radius: 0 10px 10px 0;
  border: none;
  position: relative;
  z-index: 10;
  height: 96%;
  padding-left: 10px;
  
  &:focus{
    outline: none;
    background-color: aliceblue;
  }
`

const SendButton = styled.button`
  min-width: calc(20%);
  border: none;
  background-color: #10233a;
  color: white;
  font-family: "Roboto Light", sans-serif;
  font-weight: 600;
  position: absolute;
  right: 0;
  top: 0;
  z-index: 1;
  height: 100%;
  padding-left: 20px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #142c49;
    cursor: pointer;
  }

`
const ChatHeader = styled.h2`
 margin: 0;
 display: inline-block;
 background-color: #10233a;
 font-family: "Roboto Light", sans-serif;
 font-weight: 600;
 width: 100%;
 color: white;
 text-align: center;
 padding: 5px 0;
`

const ChatMessage = styled.div`
  ${(props) => props.sender ? {'align-self': 'flex-end','background-color': '#82aec2'} : {'align-self': 'flex-start', 'background-color': '#cfeafa'}};
  ${(props) => props.resp ? { 'border': '1px solid #000'} : {}};
  margin: 10px;
  width: 200px;
  border-radius: 10px;
  padding: 10px;
  position: relative;
`

const ResponseToMessage = styled.div`
  ${(props) => props.sender ? {'align-self': 'flex-end','background-color': '#82aec2'} : {'align-self': 'flex-start', 'background-color': '#cfeafa'}};
  width: 180px;
  height: 80px;
  border-radius: 10px;
  padding: 10px;
`

const MessageText = styled.p`
  margin: 0;
  max-width: 180px;
  font-family: "Roboto Light", sans-serif;
  overflow-wrap: break-word;
  padding-bottom: 10px;
`

const MessageTime = styled.p`
  margin: 0;
  position: absolute;
  ${(props) => props.sender ? {'right': '4px'} : {'left': '4px'}};
  bottom: 4px;
  font-size: 12px;
  font-family: "Roboto Light", sans-serif;
`

const ChatPlaceholder = styled.div`
  height: 500px;
  width: 500px;
  border-radius: 20px;
  background-color: #10233a;
  color: white;
  font-family: "Roboto Light", sans-serif;
  font-weight: 600;
  display: flex;
  justify-content: center;
  align-items: center;
`