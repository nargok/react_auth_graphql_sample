import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter } from "react-router-dom";
import { Route } from "react-router";

import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import Login from "./components/Login";

ReactDOM.render(
  <BrowserRouter>
    <React.Fragment>
      <Route exact="/" component={App} />
      <Route path="/login" component={Login} />
    </React.Fragment>
  </BrowserRouter>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
