import { gql } from '@apollo/client';

export const GET_ALL_EXPERIENCES_QUERY = gql`
    query getAllExperiences {
        getAllExperiences {
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
