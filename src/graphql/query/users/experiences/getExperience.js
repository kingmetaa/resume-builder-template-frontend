import { gql } from '@apollo/client';

export const GET_EXPERIENCE_QUERY = gql`
    query getExperience($id: Int!) {
        getExperience(id: $id) {
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
`;
