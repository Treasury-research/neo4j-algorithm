const {
  GraphQLObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLInt,
} = require("graphql");
const AddressType = require("./address");

const ResultType = new GraphQLObjectType({
  name: "result",
  fields: () => ({
    total: { type: new GraphQLNonNull(GraphQLInt) },
    data: { type: new GraphQLList(AddressType) },
  }),
});

module.exports = ResultType;
