import React, {useEffect, useState} from "react";
import styled from "styled-components";

function UserList({socket, username, chatRoom, setChatRoom}) {
    const [userList, setUserList] = useState([]);

    const allUsers = userList.filter((user) => user.name !== username).map((user) => <UserListEntry
            key={user.name}
            selected={chatRoom.includes(user.name)}
        >
        <UserName
        onClick={async () => {
            if(chatRoom) {
               await socket.emit('changeRoom', chatRoom)
            }
            setChatRoom(username > user.name ? `${user.name}-${username}` : `${username}-${user.name}`)
          }
        }
        >
        {user.name}
        </UserName>
        <UserStatus
            online={user.online}
            selected={chatRoom.includes(user.name)}
        >
            {user.online ? 'В сети' : 'Не в сети'}
        </UserStatus>
    </UserListEntry>
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

    return (
        <UserListContainer>
          <UserListHeading>Список пользователей</UserListHeading>
            {allUsers}
        </UserListContainer>
)}

export default React.memo(UserList);

const UserListContainer = styled.div`
   overflow-y: auto;
  max-height: 600px;
   width: 500px;
   border: none;
   border-radius: 20px;
  background-color: white;
  display: flex;
  flex-flow: column;
  justify-content: center;
  align-items: center;
`

const UserListHeading = styled.h2`
  font-family: "Roboto Light", sans-serif;
  background-color: #10233a;
  width: 100%;
  margin: 0;
  text-align: center;
  padding: 15px 0;
  color: white;
`

const UserListEntry = styled.div`
  width: 100%;
  height: 100px;
  display: flex;
  align-items: center;
  background-color:  ${(props) => props.selected ? '#2f76dc' : '#498de7'};
  padding: 10px 0;
`

const UserName = styled.p`
  font-family: "Roboto Light", sans-serif;
  font-size: 32px;
  border-radius: 0 10px 10px 0;
  z-index: 20;
  background-color: white;
  width: 80%;
  display: flex;
  align-items: center;
  margin: 0;
  height: 100%;
  padding-left: 10px;
  transition: background-color 0.2s;

  &:hover {
    background-color: #cffaf5;
    cursor: pointer;
  }
`

const UserStatus = styled.p`
  color: ${(props) => props.online ? 'white' : 'black'};
  background-color:  ${(props) => props.selected ? '#2f76dc' : '#498de7'};
  margin: 0;
  z-index: 1;
  width: calc(20% + 20px);
  text-align: center;
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: 10px;
`