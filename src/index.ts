import express from 'express'
import { graphqlHTTP } from 'express-graphql'
import { buildSchema, graphql, GraphQLSchema } from 'graphql'

const schema = buildSchema(`
type MyType {
  id: ID!
}

type Query {
  foo: String!
  bar: String!
  baz(arg1: Int): String!
  myType: MyType!
}`)

const rootValue = {
  foo: () => {
    const value = 'foo!'
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(value)
        resolve(value)
      }, 200)
    })
  },
  bar: async () => {
    const value = 'bar!'
    console.log(value)
    return value
  },
  baz: ({ arg1 }) => {
    console.log(arg1)
    return arg1
  },
  myType: () => {
    return {
      id: async () => {
        return Date.now()
      }
    }
  }
}

// graphql({ schema, rootValue, source: '{ myType }' }).then((result) => {
//   console.log(JSON.stringify(result))
// })

const app = express()
app.use('/api', graphqlHTTP({
  schema,
  rootValue,
  graphiql: true
}))
app.listen(3000)
console.log('Running a GraphQL API server at http://localhost:3000/api')
