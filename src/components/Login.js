import React, { Component } from 'react';
import gql from 'graphql-tag';
import { Mutation } from 'react-apollo';
import { AUTh_TOKEN } from "../constants";

const OBTAIN_TOKEN = gql`
  mutation getAuthToken($name: String!, $password: String!){
    obtainToken(username: $name, password: $password) {
      token
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
          onCompleted={data => this._confirm(data)}
        >
          {
            mutation => (
              <button onClick={mutation}>
                ログインする
              </button>
            )
          }
        </Mutation>
      </div>
    )
  }

  _confirm = async data => {
    const { token } = data.obtainToken;
    this._saveUserData(token);
    this.props.history.push('/');
  };

  _saveUserData = token => {
    localStorage.setItem(AUTh_TOKEN, token);
  };

};

export default Login;