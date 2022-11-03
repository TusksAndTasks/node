import './App.css';
import {io} from "socket.io-client";
import {useCallback, useState} from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import ChatPage from "./pages/ChatPage";

const socket = io.connect('http://localhost:3001')


function App() {
    const [login, setLogin] = useState('');

    const memoizedSetLogin = useCallback(setLogin, []);

  return (
    <div className="App">
        <Routes>
            <Route path='/' element={<AuthPage setLogin={memoizedSetLogin} login={login} socket={socket}  />}  />
            <Route path='/users' element={login ? <ChatPage socket={socket} username={login} /> : <Navigate replace to="/" />} />
        </Routes>
    </div>
  );
}

export default App;
