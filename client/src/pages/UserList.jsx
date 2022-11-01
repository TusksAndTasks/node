import React, {useEffect, useState} from "react";

function UserList({socket, username, chatRoom, setChatRoom}) {
    const [userList, setUserList] = useState([]);

    const allUsers = userList.filter((user) => user.name !== username).map((user) => <p
        key={user.name}
        style={{color: user.online ? 'green' : 'gray', fontSize: '32px'}}
        onClick={() => setChatRoom(username > user.name ? `${user.name}-${username}` : `${username}-${user.name}`)}
        >
        {user.name}
        </p>
    )

    useEffect(() => {
       if(chatRoom){
            socket.emit('joinRoom', chatRoom)
        }
    }, [chatRoom]);

    useEffect(() => {
        socket.emit('getUserList');
    }, [socket]);

    useEffect(() => {
        socket.on('sendUserList', (data) => {
            setUserList(data);
        });
        socket.on('logoff', () => {
            socket.emit('getUserList');
        })
    }, []);

    console.log(userList);

    return (
        <div>
          <h2>List of Users</h2>
            {allUsers}
        </div>
)}

export default React.memo(UserList);