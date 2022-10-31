import './App.css';
import {io} from "socket.io-client";
import {useCallback, useState} from "react";
import {Routes, Route, Navigate} from "react-router-dom";
import AuthPage from "./pages/AuthPage";
import UserListPage from "./pages/UserListPage";

const socket = io.connect('http://localhost:3001')


function App() {
    const [login, setLogin] = useState('');

    const memoizedSetLogin = useCallback(setLogin, []);

  return (
    <div className="App">
        <h1>{login}</h1>
        <Routes>
            <Route path='/' element={<AuthPage setLogin={memoizedSetLogin} login={login} socket={socket}  />}  />
            <Route path='/users' element={login ? <UserListPage socket={socket} /> : <Navigate replace to="/" />} />
        </Routes>
    </div>
  );
}

export default App;
