import { GraphQLServer } from 'graphql-yoga';
import uuidv4 from 'uuid/v4';

const comments = [
    {
        id: 12345,
        text: 'It does indeed take great skill thanks blue bottle',
        author: 'blue bottle',
        post: 123
    },
    {
        id: 1234,
        text: 'Aeropress is simply the best thanks Stumptown you guys are kind of hipster dummies',
        author: 'Stumptown',
        post: 666
    },
    {
        id: 123,
        text: 'Not bad, mostly use while camping cause it\'s so easy thanks Coffee guy',
        author: 'Coffee guy',
        post: 6666
    }
]

const posts = [
    {
        title: 'how to brew hario V60',
        body: 'with great skill',
        author: 'blue bottle',
        published: false,
        id: 123
    },
    {
        title: 'how to brew aeropress',
        body: 'arguable the best brew you\'ll  find however not everyone will agree with this',
        author: 'Stumptown',
        published: true,
        id: 666
    },
    {
        title: 'how to brew french press',
        body: 'Not too complicated. gives some of that good ole sludge',
        author: 'Coffee guy',
        published: true,
        id: 6666
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
  type Mutation {
    createUser(name: String!, email: String!, age: Int): User!,
    createPost(title: String!, body: String!, published: Boolean!, name: String!): Post!
  },

  type Query {
    users: [User!]!
    me: User!
    post: Post!,
    posts(query: String): [Post!],
    comments: [Comment!]
  },

  type User {
    id: ID!,
    name: String!,
    age: Int,
    occupation: String!,
    email: String!,
    posts: [Post!],
    comments: [Comment!]
  },

  type Post {
      title: String!,
      body: String,
      author: User!,
      published: Boolean,
      id: ID!,
      comments: [Comment!]
  },

  type Comment {
      id: ID!,
      text: String!,
      author: User!,
      post: [Post!]
  }
`

// Resolvers
const resolvers = {
    Mutation: {
        createUser(parent, args, ctx, info) {
            const emailTaken = users.some((user) => user.email === args.email )

            if(emailTaken) {
                throw new Error('error already taken')
            }

            const user = {
                id: uuidv4(),
                name: args.name,
                email: args.email,
                age: args.age
            }

            users.push(user)
            return user
        },
        createPost(parent, args, ctx, info) {
            const emailUsed = users.some((user) => user.email === args.email );
            if(!emailUsed) {
                throw new Error('can\'t do that!!')
            }

            const post = {
                id: uuidv4(),
                title: args.title,
                body: args.body,
                published: args.published,
                author: args.author
            }

            posts.push(post)
            return post
        }
    },

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
            // if(!args) {
            //     return posts
            // }
            // return posts.filter((post) => {
            //     return post.title.toLowerCase().includes(args.query)
            // });
            return posts
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
        },
        comments(parent, args, ctx, info) {
            return comments.filter((comment) => 
                comment.post === parent.id
            )
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
        },
        post(parent, args, ctx, info) {
            return posts.filter((post) => 
                post.id === parent.post
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