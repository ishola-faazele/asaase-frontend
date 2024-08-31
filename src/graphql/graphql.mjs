// Import necessary modules
import { gql, request } from 'graphql-request';

// Define the GraphQL endpoint URL
const url = 'https://api.studio.thegraph.com/query/84868/asaase-subgraph/version/latest';

// Define the GraphQL queries
// Define the GraphQL queries
const queries = {
    ALL_LANDS: gql`
        query {
            lands(first: 100) {
                id
                boundaryPoints {
                    latitude
                    longitude
                }
                value
                owner
                details {
                    size
                    zoning
                    landName
                    region
                    city
                    imageUrl
                }
            }
        }
    `,
    LAND_DETAILS: gql`
        query LandDetails($id: ID!) {
            land(id: $id) {
                id
                boundaryPoints {
                    latitude
                    longitude
                }
                value
                owner
                details {
                    size
                    zoning
                    landName
                    region
                    city
                    imageUrl
                }
            }
        }
    `,
    LANDS_BY_OWNER: gql`
        query LandsByOwner($owner: String!) {
            lands(where: { owner: $owner }) {
                id
                boundaryPoints {
                    latitude
                    longitude
                }
                value
                details {
                    size
                    zoning
                    landName
                    region
                    city
                    imageUrl
                }
            }
        }
    `,
    TOTAL_SUPPLY: gql`
        query {
            totalSupply(id: "asaase-token") {
                value
            }
        }
    `,
    MOST_TOKENS_ACCOUNT: gql`
        query {
            accounts(orderBy: tokenBalance, orderDirection: desc, first: 1) {
                id
                tokenBalance
            }
        }
    `,
    TOP_MOST_EXPENSIVE_TOKENS: gql`
        query TopMostExpensiveTokens($first: Int!) {
            lands(orderBy: value, orderDirection: desc, first: $first) {
                id
                value
                owner
            }
        }
    `,
    TRANSACTIONS_BY_USER: gql`
        query TransactionsByUser($user: String!) {
            transactions(where: { from: $user }, orderBy: timestamp, orderDirection: desc) {
                id
                from
                to
                value
                timestamp
            }
        }
    `
};


// Define the GraphQL class
class GraphQLClient {
    constructor() {
        this.url = url;
    }

    // Function to fetch all lands
    async fetchAllLands() {
        return await request(this.url, queries.ALL_LANDS);
    }

    // Function to fetch details of a specific land by ID
    async fetchLandDetails(id) {
        return await request(this.url, queries.LAND_DETAILS, { id });
    }

    // Function to fetch lands owned by a specific address
    async fetchLandsByOwner(owner) {
        return await request(this.url, queries.LANDS_BY_OWNER, { owner });
    }

    // Function to fetch the total supply of tokens
    async fetchTotalSupply() {
        return await request(this.url, queries.TOTAL_SUPPLY);
    }

    // Function to fetch the account with the most tokens
    async fetchMostTokensAccount() {
        return await request(this.url, queries.MOST_TOKENS_ACCOUNT);
    }

    // Function to fetch the top x most expensive tokens
    async fetchTopMostExpensiveTokens(first) {
        return await request(this.url, queries.TOP_MOST_EXPENSIVE_TOKENS, { first });
    }

    // Function to fetch transactions by a specific user
    async fetchTransactionsByUser(user) {
        return await request(this.url, queries.TRANSACTIONS_BY_USER, { user });
    }
}

// Export the class as a module
export default GraphQLClient;
