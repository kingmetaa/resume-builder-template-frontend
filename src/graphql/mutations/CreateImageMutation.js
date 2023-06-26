import { gql } from '@apollo/client';

export const CREATE_IMAGE_MUTATION = gql`
    mutation CreateImage($filename: String!, $mimetype: String!, size: Int! , userId: ID!) {
        createImage(filename: $filename, mimetype: $mimetype, size: $size, userId: $userId) {
            id
            filename
            mimetype
            size
            created_at
        }
    }
`;
