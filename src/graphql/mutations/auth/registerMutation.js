import { gql } from '@apollo/client';

export const REGISTER_MUTATION = gql`
    mutation register($email: String!, $password: String!, $name: String!, $age: Int!) {
        register(email: $email, password: $password, name: $name, age: $age) {
            id
            name
            email
            age
            profilePicture
        }
    }
`;
