import { GraphQLServer } from 'graphql-yoga';

const comments = [
    {
        id: 12345,
        text: 'It does indeed take great skill thanks blue bottle',
        author: 'blue bottle'
    },
    {
        id: 1234,
        text: 'Aeropress is simply the best thanks Stumptown you guys are kind of hipster dummies',
        author: 'Stumptown'
    },
    {
        id: 123,
        text: 'Not bad, mostly use while camping cause it\'s so easy thanks Coffee guy',
        author: 'Coffee guy'
    }
]

const posts = [
    {
        title: 'how to brew hario V60',
        body: 'with great skill',
        author: 'blue bottle',
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
    posts(query: String): [Post!],
    comments: [Comment!]
  },

  type User {
    id: Int!,
    name: String!,
    age: Int,
    occupation: String!  
    posts: [Post!],
    comments: [Comment!]
  },

  type Post {
      title: String!,
      body: String,
      author: User!,
      published: Boolean,
  },

  type Comment {
      id: Int!,
      text: String!,
      author: User!
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
            return post
        },
        posts(parent, args, ctx, info) {
            if(!args) {
                return posts
            }
            return posts.filter((post) => {
                return post.title.toLowerCase().includes(args.query)
            });
        },
        comments(parent, args, ctx, info) {
            return comments
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
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => 
                comment.author === parent.name
            )
        }
    },
    Comment: {
        author(parent, args, ctx, info) {
            return users.find((user) => 
                user.name === parent.author
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