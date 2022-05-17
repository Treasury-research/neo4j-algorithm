const { GraphQLObjectType, GraphQLNonNull, GraphQLString } = require("graphql");

const AddressType = new GraphQLObjectType({
  name: "address",
  fields: () => ({
    address: { type: new GraphQLNonNull(GraphQLString) },
  }),
});

module.exports = AddressType;
