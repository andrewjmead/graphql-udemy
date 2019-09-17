import { GraphQLServer } from 'graphql-yoga';

// Type definitions (schema)
const typeDefs = `
  type Query {
    sumTotal(numbers: [Float!]!): Float!
  }
`

// Resolvers
const resolvers = {
    Query: {
        sumTotal(paretn, args, ctx, info){
            
            var x = args.numbers.reduce((acc, elem) => {
                return acc+elem
            })
            console.log(x)
            return x;
        }
    }
}

const server = new GraphQLServer({
    typeDefs,
    resolvers
});

server.start(() => {
    console.log('server is up')
})