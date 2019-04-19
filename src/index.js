import React from 'react';
import ReactDOM from 'react-dom';

import { BrowserRouter } from "react-router-dom";
import { Route } from "react-router";
import { HttpLink } from 'apollo-link-http';
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloClient } from 'apollo-client';
import { ApolloProvider } from 'react-apollo';
import { onError } from "apollo-link-error";
import { ApolloLink, Observable } from "apollo-link";

import * as serviceWorker from './serviceWorker';
import {setContext} from "apollo-link-context";
import {AUTh_TOKEN, REFRESH_TOKEN} from "./constants";

import App from './App';
import Login from "./components/Login";
import Logout from "./components/Logout";
import './index.css';
import UserList from "./components/UserListFromOtherService";
import { getNewToken } from "./getNewToken";

const APP_BASE_URL = "http://localhost:8080/graphql";

const httpLink = new HttpLink({
  uri: APP_BASE_URL,
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem(AUTh_TOKEN);
  return {
    headers: {
      ...headers,
      authorization: token ? token : ''
    }
  }
});

const errorLink = onError(  ({ graphQLErrors, networkError, operation, forward }) => {
  if (graphQLErrors) {
    for (let err of graphQLErrors) {
      switch (err.extensions.code) {
        case 'BAD_USER_INPUT':
          console.log("もう一度入力内容を確認させよう");
          break;
        case 'UNAUTHENTICATED':
            console.log("ここで新しいtokenを取得して再実行する");
            return new Observable(observer => {
                getNewToken().then(newAccessToken => {
                    operation.setContext(({ headers = {}}) => ({
                        headers: {
                            ...headers,
                            authorization: newAccessToken || null,
                        }
                    }));
                    localStorage.removeItem(AUTh_TOKEN);
                    localStorage.setItem(AUTh_TOKEN, newAccessToken);
                }).then(() => {
                    const subscriber = {
                        next: observer.next.bind(observer),
                        error: observer.error.bind(observer),
                        complete: observer.complete.bind(observer)
                    };
                    // Retry last failed request
                    forward(operation).subscribe(subscriber);
                })
                .catch(error => {
                    // No refresh or client token available, we force user to login
                    observer.error(error)
                })
            });
        default:
      }
    }
  }
  if (networkError) console.log(`[Network error]: ${networkError}`);
});

const cache = new InMemoryCache();

const client = new ApolloClient({
  // errorLink, authLink, httpLinkの順番じゃないと適用できない
  link: ApolloLink.from([authLink, errorLink, httpLink]),
  cache,
});

ReactDOM.render(
  <ApolloProvider client={client}>
    <BrowserRouter>
      <React.Fragment>
        <Route exact path="/" component={App} />
        <Route path="/login" component={Login} />
        <Route path="/logout" component={Logout} />
        <Route path="/users" component={UserList} />
      </React.Fragment>
    </BrowserRouter>
  </ApolloProvider>,
  document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();