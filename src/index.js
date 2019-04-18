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

import gql from 'graphql-tag';
import { print } from 'graphql';
import axios from 'axios';

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
      authorization: token ? `Bearer ${token}` : ''
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
          // if (localStorage.getItem(AUTh_TOKEN) && localStorage.getItem(REFRESH_TOKEN)) {
            console.log("ここで新しいtokenを取得して再実行する");
            return new Observable(observer => {
                getNewToken().then(newAccessToken => {
                    operation.setContext(({ headers = {}}) => ({
                        headers: {
                            ...headers,
                            authorization: `Bearer ${newAccessToken}` || null,
                        }
                    }))
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
            })

            // TODO 一度封印
            // getNewToken().then(token => {
            //     console.log("newToken is :" + token)
            //     // Todo 一旦ローカルストレージの更新をはずす
            //     // localStorage.removeItem(AUTh_TOKEN);
            //     // localStorage.setItem(AUTh_TOKEN, token);
            //     operation.setContext({
            //         headers: {
            //             ...oldHeaders,
            //             authorization: `Bearer ${token}`
            //             // authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTU1NTc0NTYxLCJqdGkiOiJhNDc5MjhkYTIwYWM0ZjI1OTAyMTcyZDBiNWFmMTY2NiIsInVzZXJfaWQiOjEsIm5hbWUiOiJhZG1pbiIsImlzX3N1cGVydXNlciI6dHJ1ZX0.QBx0txf46_QPqo0zoOGwbW-TO_4S51HpeC1QZ3WSApg`
            //         }
            //     });
            //     console.log(operation.getContext().headers)
            //     return forward(operation);
            // })
            // console.log(newToken)
            // operation.setContext({
            //     headers: {
            //         ...oldHeaders,
            //         // TODO　ここのreturnがundefinedになる これがPromiseか？？
            //         // authorization: `Bearer ${getNewToken().then(access => access )}`
            //         // authorization: `Bearer ${newToken}`
            //         // authorization: `Bearer ${getNewToken()}`
            //         // authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTU1NTYzMzk3LCJqdGkiOiI3YTU3YWI0YmViYjM0OWNlOWFkNGVmM2ZmMTg4NmQ3ZiIsInVzZXJfaWQiOjEsIm5hbWUiOiJhZG1pbiIsImlzX3N1cGVydXNlciI6dHJ1ZX0.4rRMM0zSELFZL5lepkz0zFzZe7Bs_GVIS-XFuRanRjY`
            //     }
            // });
            // console.log(operation.getContext().headers);



            // 一旦コメントアウト
            // return new Observable(observer => {
            //     getNewToken().then(response => {
            //         const newAccessToken = response.data.data.refreshToken.access;
            //         console.log("新しいアクセストークン: " + newAccessToken);
            //         // アクセストークンの入れ替え
            //         operation.setContext({
            //             headers: {
            //                 ...oldHeaders,
            //                 authorization: `Bearer ${newAccessToken}`,
            //             }
            //         })
            //         console.log(operation.getContext().headers)
            //     }).then(() => {
            //         const subscriber = {
            //             next: observer.next.bind(observer),
            //             error: observer.error.bind(observer),
            //             complete: observer.complete.bind(observer)
            //         };
            //         // Retry last failed request
            //         // 失敗したリクエストをもう一度実行
            //         forward(operation).subscribe(subscriber)
            //     }).catch(error => {
            //         // No refresh or client token available, we force user to login
            //         // リフレッシュトークンが切れているので再ログインが必要
            //         observer.error(error)
            //     })
            // })

            // const oldHeaders = operation.getContext().headers;
            // const promise = getNewTokenPromise();
            // console.log(promise);
            // return promiseToObservable(promise).flatMap((newToken) => {
            //   console.log("新しいトークン: " + newToken);
            //   operation.setContext({
            //     headers: {
            //       ...oldHeaders,
            //       authorization: newToken,
            //     },
            //   });
            //   return forward(operation);
            // });

                  // operation.setContext({
                  //     headers: {
                  //         ...oldHeaders,
                  //         authorization: `Bearer ${token}`
                  //         // authorization: `Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTU1NTc0NTYxLCJqdGkiOiJhNDc5MjhkYTIwYWM0ZjI1OTAyMTcyZDBiNWFmMTY2NiIsInVzZXJfaWQiOjEsIm5hbWUiOiJhZG1pbiIsImlzX3N1cGVydXNlciI6dHJ1ZX0.QBx0txf46_QPqo0zoOGwbW-TO_4S51HpeC1QZ3WSApg`
                  //     }
                  // });


            // return new Observable(observer => {
            //   getNewToken().then(newAccessToken => {
            //     console.log("新しいアクセストークン: " + newAccessToken);
            //     operation.setContext({
            //       headers: {
            //         ...oldHeaders,
            //         authorization: `Bearer ${newAccessToken}`,
            //       }
            //   }).then(() => {
            //      const subscriber = {
            //        next: observer.next.bind(observer),
            //        error: observer.error.bind(observer),
            //        complete: observer.complete.bind(observer)
            //      };
            //       console.log({oldHeaders});
            //       // 新しいアクセストークンを使って、認証エラーになった処理を再実行する
            //       return forward(subscriber);
            //     }).catch(error => {
            //       observer.error(error);
            //     })
            //   })
            // });
          // break;
        // TODO リフレッシュトークンがexpireになったときの制御を追加
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

const TOKEN_REFRESH = gql`
  mutation refreshToken($token: String!) {
    refreshToken(refresh: $token) {
      access
    }
  }
`;

// TODO 新しいtokenを取得する処理を実装する
const getNewTokenPromise = () => {
  // TODO localstorageからrefreshtokenを取得するようにする
  return new Promise(function(resolve, reject)  {
    resolve("eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTU1NDgxNzI5LCJqdGkiOiI4MTM3NTI5ZDYxNjk0MjZjODFjNGUzNjM0MDM4OThlZiIsInVzZXJfaWQiOjF9.I0WVkZV3pzJNbwI4DoRl_sIpEWO1HFjWwy6gudnXtNc")
  });
};

// const getNewToken = () => {
//   const refreshToken = localStorage.getItem(REFRESH_TOKEN);
//   axios.post(APP_BASE_URL, {
//     query: print(TOKEN_REFRESH),
//     variables: { token: refreshToken } }
//   ).then(res => {
//       const newAccessToken = res.data.data.refreshToken.access;
//       console.log(newAccessToken);
//       return newAccessToken;
//   });
//
//   // console.log("NewTokenを取るよ" + newAccessToekn);
//   // return newAccessToekn;
//   // return "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJ0b2tlbl90eXBlIjoiYWNjZXNzIiwiZXhwIjoxNTU1NDgxNzI5LCJqdGkiOiI4MTM3NTI5ZDYxNjk0MjZjODFjNGUzNjM0MDM4OThlZiIsInVzZXJfaWQiOjF9.I0WVkZV3pzJNbwI4DoRl_sIpEWO1HFjWwy6gudnXtNc"
// }

const promiseToObservable = (promise) => {
  return new Observable((subscriber) => {
    promise.then(
        (value) => {
          if (subscriber.closed) {
            return;
          }
          subscriber.next(value);
          subscriber.complete();
        },
        (err) => {
          subscriber.error(err);
        },
    );
  });
};
