import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

const USER_LIST = gql`
    {
      usersFromExternalService {
        username
      }
    }
`;

const UserList = () => {
    return (
        <div>
            <h1>User List</h1>
            <Query query={USER_LIST}>
                {({ loading, error, data}) => {
                    if (loading) { return <div>Loading...</div> }
                    else if (error) { return <div>error occurred...</div> }
                    else {
                        console.log(data);
                        return <p>処理結果はコンソールに出ます。</p>
                    }
                }}
            </Query>
        </div>
    )
};

export default UserList;