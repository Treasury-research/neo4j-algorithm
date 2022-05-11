const { GraphQLObjectType, GraphQLFloat, GraphQLString } = require("graphql");

const SimilarityType = new GraphQLObjectType({
  name: "similarity",
  fields: () => ({
    from: { type: GraphQLString },
    to: { type: GraphQLString },
    similarity: { type: GraphQLFloat },
  }),
});

module.exports = SimilarityType;
