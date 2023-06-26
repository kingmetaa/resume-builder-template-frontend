import { gql } from '@apollo/client';

export const SINGLE_UPLOAD_MUTATION = gql`
    mutation UploadImage($file: Upload!) {
        uploadImage(file: $file) {
            id
            filename
            mimetype
            size
            created_at
        }
    }
`;
