const { buildSchema } = require("graphql");

module.exports.schema = buildSchema(`
    type Query {
        hello: String
    }
    type Subscription {
        countDown: Int
    }
`);

const roots = {
  Query: {
    hello: () => "Hello World!",
  },
};

module.exports.rootValue = {
  hello: roots.Query.hello,
};
