import { GraphQLServer } from 'graphql-yoga';

// Type definitions (schema)
const typeDefs = `
  type Query {
    title: String!
    price: Float!
    releaseYear: Int
    rating: Float
    inStock: Boolean!
  }
`

// Resolvers
const resolvers = {
    Query: {
        title() {
            return 'low beams'
        },
        price() {
            return 2.33
        },
        releaseYear() {
            return null
        },
        rating() {
            return 9.00
        },
        inStock() {
            return true;
        }
    },   
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
    console.log('server is up')
})