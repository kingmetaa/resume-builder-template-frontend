import { gql } from '@apollo/client';

export const DELETE_EXPERIENCE_MUTATION = gql`
    mutation deleteExperience($id: Int!) {
        deleteExperience(id: $id) {
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
