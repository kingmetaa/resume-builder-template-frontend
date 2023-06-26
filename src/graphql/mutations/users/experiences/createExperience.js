import { gql } from '@apollo/client';

export const CREATE_EXPERIENCE_MUTATION = gql`
    mutation createExperience(
        $userId: Int!
        $company: String!
        $companyLogo: String
        $startDate: String!
        $endDate: String
        $jobTitle: String!
        $description: String
    ) {
        createExperience(
            userId: $userId
            company: $company
            companyLogo: $companyLogo
            startDate: $startDate
            endDate: $endDate
            jobTitle: $jobTitle
            description: $description
        ) {
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
