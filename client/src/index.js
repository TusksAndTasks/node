import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import {createGlobalStyle} from "styled-components";

const root = ReactDOM.createRoot(document.getElementById('root'));
const GlobalStyle = createGlobalStyle`
  body {
    margin: 0;
    height: 100%;
  }
`

root.render(
  <React.StrictMode>
    <App />
    <GlobalStyle />
  </React.StrictMode>
);

