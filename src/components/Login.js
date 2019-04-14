import React, { Component } from 'react';

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
        <button>
          ログインする
        </button>
      </div>
    )
  }
};

export default Login;