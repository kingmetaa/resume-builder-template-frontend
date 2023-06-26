import { gql } from '@apollo/client';

export const CREATE_USER_MUTATION = gql`
    mutation createUser($name: String!, $email: String!, $password: String!, $age: Int!) {
        createUser(name: $name, email: $email, password: $password, age: $age) {
            id
            name
            email
            age
        }
    }
`;
