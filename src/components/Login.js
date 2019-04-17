import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { AUTh_TOKEN, REFRESH_TOKEN } from "../constants";

const OBTAIN_TOKEN = gql`
  mutation getAuthToken($name: String!, $password: String!){
    obtainToken(username: $name, password: $password) {
      access
      refresh
    }
  }
`;


class Login extends Component {
  state = {
    name: "",
    password: ""
  };

  handleChangeName = (name) => {
    this.setState({ name: name })
  };

  handleChangePassword = (password) => {
    this.setState({ password: password })
  };

  render () {
    const { name, password } = this.state;

    return (
      <div>
        <div>
          <input type="text"
                 placeholder="ログイン名を入力"
                 onChange={ event => this.handleChangeName(event.target.value) }
          />
        </div>
        <div>
          <input type="password"
                 onChange={ event => this.handleChangePassword(event.target.value) }
          />
        </div>
        <Mutation
          mutation={OBTAIN_TOKEN}
          variables={{ name, password }}
          onError={(error) => this._displayError(error)}
          onCompleted={data => this._confirm(data)}
        >
          {(mutation, { loading, error }) => (
            <div>
              <button onClick={mutation}>
                ログインする
              </button>
              { error && <p>ユーザIDまたはパスワードが間違っています</p> }
            </div>
          )}
        </Mutation>
      </div>
    )
  }

  _confirm = data => {
    const { access, refresh } = data.obtainToken;
    this._saveUserData(access, refresh);
    this.props.history.push('/');
  };

  _saveUserData = (access, refresh) => {
    localStorage.setItem(AUTh_TOKEN, access);
    localStorage.setItem(REFRESH_TOKEN, refresh);
  };

  _displayError = (error) => {
    console.log("GraphQLError: " + error.graphQLErrors[0].extensions.code);
    console.log("GraphQLError: " + error.graphQLErrors[0].message);
    alert("ユーザID、またはパスワードが間違っています");
  };

};

export default Login;