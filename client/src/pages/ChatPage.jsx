import React, {useCallback, useState} from "react";
import UserList from "./UserList";
import Chat from "./Chat";

function ChatPage({socket, username}){
    const [chatRoom, setChatRoom] = useState('');

    const memoizedSetChatRoom = useCallback(setChatRoom, []);


    return(
        <div>
         <UserList socket={socket} username={username} chatRoom={chatRoom} setChatRoom={memoizedSetChatRoom} />
         <Chat socket={socket} username={username} chatRoom={chatRoom} />
        </div>
    )
}

export default React.memo(ChatPage);