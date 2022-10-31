import React, {useEffect} from "react";
import {useNavigate} from "react-router-dom";

function AuthPage({ setLogin, login, socket }) {
    const navigate = useNavigate();

    const loginUser = () => {
        socket.emit('login', login)
    }

    return(
        <div>
          <h2>Войти</h2>
          <input type='text' placeholder='Ваш логин' onChange={(event) => setLogin(event.target.value)}/>
          <button onClick={(e) => {
              e.preventDefault();
              loginUser();
              navigate('/users')
          } }>Войти</button>
        </div>
)}

export default React.memo(AuthPage);