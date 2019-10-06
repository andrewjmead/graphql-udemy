import { GraphQLServer } from 'graphql-yoga';


const posts = [
    {
        title: 'how to brew hario V60',
        body: 'with great skill',
        author: 12345,
        published: false
    },
    {
        title: 'how to brew aeropress',
        body: 'arguable the best brew you\'ll  find however not everyone will agree with this',
        author: 'Stumptown',
        published: true
    },
    {
        title: 'how to brew french press',
        body: 'Not too complicated. gives some of that good ole sludge',
        author: 'Coffee guy',
        published: true
    }
];

const users = [
    {
        id: 123,
        name: 'Coffee guy',
        age: 45,
        occupation: 'Software'
    },
    {
        id: 1234,
        name: 'Stumptown',
        age: 17,
        occupation: 'coffee shop'
    },
    {
        id: 12345,
        name: 'blue bottle',
        occupation: 'coffee producers'
    }
]

// Type definitions (schema)
const typeDefs = `
  type Query {
    users: [User!]!
    me: User!
    post: Post!,
    posts(query: String): [Post!]
  },

  type User {
    id: Int!,
    name: String!,
    age: Int,
    occupation: String!  
    posts: [Post!]
  },

  type Post {
      title: String!,
      body: String,
      author: User!,
      published: Boolean,
  }
`

// Resolvers
const resolvers = {
    Query: {
        users(parent, args, ctx, info) {
            return users
        },
        me() {
            return {
                id: 12356,
                name: 'tom',
                occupation: 'builder'
            }
        },
        post(parent, args, ctx, info) {
            
        },
        posts(parent, args, ctx, info) {
            if(!args) {
                return posts
            }
            return posts.filter((post) => {
                return post.title.toLowerCase().includes(args.query)
            });
        }
    },  
    Post: {
        author(parent, args, ctx, info) {
            if(!args){
                return posts;
            }
            return users.find((user) => {
                return user.name === parent.author
            })
        }
    },
    User: {
        posts(parent, args, ctx, info) {
            return posts.filter((post) => 
                post.author === parent.name || post.author === parent.id
            )
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