import React, {useCallback, useState} from "react";
import UserList from "./UserList";
import Chat from "./Chat";
import styled from "styled-components";

function ChatPage({socket, username}){
    const [chatRoom, setChatRoom] = useState('');

    const memoizedSetChatRoom = useCallback(setChatRoom, []);


    return(
        <ChatPageContainer>
          <UserList socket={socket} username={username} chatRoom={chatRoom} setChatRoom={memoizedSetChatRoom} />
          <Chat socket={socket} username={username} chatRoom={chatRoom} />
        </ChatPageContainer>
    )
}

export default React.memo(ChatPage);

const ChatPageContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-around;
  width: 100%;
  height: 100vh;
  background-color: #234a7a;
`