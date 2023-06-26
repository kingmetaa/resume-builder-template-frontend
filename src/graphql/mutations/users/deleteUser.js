import { gql } from '@apollo/client';

export const DELETE_USER_MUTATION = gql`
    mutation deleteUser($id: Int!) {
        deleteUser(id: $id) {
            id
            name
            email
            age
        }
    }
`;
