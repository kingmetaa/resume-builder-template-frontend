import { gql } from '@apollo/client';

export const GET_ALL_USERS_QUERY = gql`
    query getAllUsers {
        getAllUsers {
            id
            name
            email
            age
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
