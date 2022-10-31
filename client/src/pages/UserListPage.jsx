import React, {useEffect, useState} from "react";

function UserListPage({socket}) {
    const [userList, setUserList] = useState([]);

    const allUsers = userList.map((user) => <p key={user.name} style={{color: user.online ? 'green' : 'gray', fontSize: '32px'}}>{user.name}</p>)

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

export default React.memo(UserListPage);