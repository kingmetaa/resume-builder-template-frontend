import { gql } from '@apollo/client';

export const GET_USER_QUERY = gql`
    query getUser($id: Int!) {
        getUser(id: $id) {
            id
            name
            email
            age
            profilePicture
            workExperience {
                id
                userId
                company
                companyLogo
                jobTitle
                startDate
                endDate
                description
            }
        }
    }
`;
