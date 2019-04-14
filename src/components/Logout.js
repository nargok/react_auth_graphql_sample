import React, { Component } from 'react';
import {AUTh_TOKEN} from "../constants";


class Logout extends Component {
  render () {
    return (
      <div>
        <h1>Logout</h1>
        <button onClick={this._logout}>
          ログアウトする
        </button>
      </div>
    )
  };

  _logout = () => {
    this._removeUserData();
    this.props.history.push("/");
  };
  _removeUserData = () => {
    localStorage.removeItem(AUTh_TOKEN);
  };
}

export default Logout;