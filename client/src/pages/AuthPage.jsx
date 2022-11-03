import React from "react";
import {useNavigate} from "react-router-dom";
import styled from "styled-components";

function AuthPage({ setLogin, login, socket }) {
    const navigate = useNavigate();

    const loginUser = () => {
        socket.emit('login', login)
    }

    return(
        <div>
        <AuthHeader>
          <AuthHeading>Авторизация</AuthHeading>
        </AuthHeader>
          <AuthContainer>
            <AuthInput
                type='text'
                placeholder='Ваш логин'
                onChange={(event) => setLogin(event.target.value)}
                onKeyPress={(event) => {
                    if(event.key === 'Enter'){
                        loginUser();
                        navigate('/users')
                    }
                }}
            />
            <AuthButton onClick={() => {
              loginUser();
              navigate('/users')
            }}>
                Войти
            </AuthButton>
         </AuthContainer>
        </div>
)}

export default React.memo(AuthPage);

const AuthHeader = styled.div`
  width: 100%;
  height: 30px;
  background-color: #10233a;
  box-shadow: 0px 3px 5px 1px rgba(0, 0, 0, .5);
  padding: 10px 0;
`

const AuthHeading = styled.h2`
  margin: 0 0 0 20px;
  font-family: "Roboto Light", sans-serif;
  color: white;
`

const AuthContainer = styled.div`
  width: 100%;
  height: calc(100vh - 50px);
  background-color: #234a7a;
  display: flex;
  align-items: center;
  justify-content: center;
`
const AuthInput = styled.input`
 width: 300px;
 border-radius: 10px; 
 border: none;
 padding: 7px;
 z-index: 2;
  
  &:focus{
    outline: none;
    background-color: aliceblue;
  }
`

const AuthButton = styled.button`
  width: 80px;
  padding: 7px 0px 7px 15px;
  border: none;
  border-radius: 0 10px 10px 0;
  background-color: #498de7;
  transform: translateX(-20px);
  transition: 500ms;
  z-index: 1;
  font-family: "Roboto Light", sans-serif;
  font-weight: 600;

  &:hover {
    transform: translateX(-10px);
    cursor: pointer;
    background-color: #64a3fd;
  }
`