import { gql } from '@apollo/client';

export const UPDATE_EXPERIENCE_MUTATION = gql`
    mutation updateExperience(
        $id: Int!
        $userId: Int!
        $company: String!
        $companyLogo: String
        $startDate: String!
        $endDate: String
        $jobTitle: String!
        $description: String
    ) {
        updateExperience(
            id: $id
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
