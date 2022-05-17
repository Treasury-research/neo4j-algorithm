const { GraphQLObjectType, GraphQLSchema } = require("graphql");

const similarityResolve = require("./query/similarity");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",

  fields: {
    ...similarityResolve(),
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
