import { gql } from '@apollo/client';

export const UPDATE_USER_MUTATION = gql`
    mutation updateUser(
        $id: Int!
        $name: String!
        $email: String
        $password: String
        $age: Int!
        $profilePicture: String
    ) {
        updateUser(
            id: $id
            name: $name
            email: $email
            password: $password
            age: $age
            profilePicture: $profilePicture
        ) {
            id
            name
            email
            age
            profilePicture
        }
    }
`;
