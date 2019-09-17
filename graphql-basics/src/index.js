import { GraphQLServer } from 'graphql-yoga';


const users = [
    { id: 1, name: 'yossarian', job: 'bombardier'},
    { id: 2, name: 'milo minderbinder', job: 'cook and contractor'},
    { id: 3, name: 'nately', job: 'chestnut hoarder'}
]

const posts = [
    {id: 11, title: 'How to perfect the aeropress', author: 'blue bottle coffee', published: true},
    {id: 12, title: 'How to make perfect Hario V60', author: 'stumptown coffee', published: false},
    {id: 13, title: 'How to use the french press', author: 'spur coffee', published: false}
]
// Type definitions (schema)
const typeDefs = `
  type Query {
    users(query: String): [User!]!
    me: User!
    posts(specificPost: String): [Post]!
  }

  type User {
      id: Int!,
      name: String!,
      age: Int,
      job: String
  }

  type Post {
      id: Int!,
      title: String!,
      author: String!,
      published: Boolean
  }
`

// Resolvers
const resolvers = {
    Query: {
        me() {
            return {
                id: 1234,
                name: 'tom',
                age: 32,
                job: 'builder'
            }
        },
        posts(partent, args, ctx, info) {
            let aPost;
            if(args.specificPost) {
                aPost = posts.filter((post) => {
                    return post.title.toLowerCase().includes(args.specificPost.toLowerCase())
                })
            }
            else {
                aPost = posts;
            }
            return aPost;
        },
        users(partent, args, ctx, info) {
            let theUsers;
            if(args && args.query) {
                theUsers = users.filter((element) => {
                    return element.name.toLowerCase().includes(args.query.toLowerCase())
                });
            }
            else{
                theUsers = users;
            }
            return theUsers;

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