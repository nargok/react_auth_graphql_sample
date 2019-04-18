import {REFRESH_TOKEN} from "./constants";
import axios from "axios";
import {print} from "graphql";
import gql from "graphql-tag";

const APP_BASE_URL = "http://localhost:8080/graphql";

const TOKEN_REFRESH = gql`
  mutation refreshToken($token: String!) {
    refreshToken(refresh: $token) {
      access
    }
  }
`;

export const getNewToken = () => {
    const refreshToken = localStorage.getItem(REFRESH_TOKEN);
    return new Promise(function(resolve, reject) {
        axios.post(APP_BASE_URL, {
                query: print(TOKEN_REFRESH),
                variables: {token: refreshToken}
            }
        ).then(res => resolve(res.data.data.refreshToken.access))
            .catch(error => reject(error))
        // const newAccessToken = res.data.data.refreshToken.access;
        // console.log(newAccessToken);
        // return newAccessToken;
    })
}
//         });
//     })
// };