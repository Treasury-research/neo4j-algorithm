const {
  GraphQLObjectType,
  GraphQLNonNull,
  GraphQLSchema,
  GraphQLString,
  GraphQLList,
  GraphQLEnumType,
} = require("graphql");
const debug = require("debug")("app");

const SimilarityType = require("./type/similarity");
const jccard = require("../algorithm/jccard");
const redis = require("../utils/redis");
const { NEO4J_PREFIX } = require("../constants");

const RootQuery = new GraphQLObjectType({
  name: "RootQueryType",
  fields: {
    similarity: {
      type: new GraphQLList(SimilarityType),
      args: {
        address: { type: new GraphQLNonNull(GraphQLString) },
        formula: {
          type: new GraphQLEnumType({
            name: "formula",
            values: {
              JACCARD: { value: "jaccard" },
              OVERLAP: { value: "overlap" },
              COSINE: { value: "cosine" },
              PEARSON: { value: "pearson" },
              EUCLIDEANDISTANCE: { value: "euclideanDistance" },
              EUCLIDEAN: { value: "euclidean" },
            },
          }), // jaccard || overlap || cosine || pearson || euclideanDistance || euclidean
        },
        relationship: {
          type: new GraphQLEnumType({
            name: "relationship",
            values: {
              RSS3_Follow: { value: "FOLLOW{source:'rss3'}" },
              Cyberconnect_Follow: { value: "FOLLOW{source:'CyberConnect'}" },
              Poap: { value: "ATTEND" },
            }, // FOLLOW || ATTEND
          }),
        },
      },

      async resolve(_parent, args) {
        try {
          const { address, formula, relationship } = args;
          const key = `${NEO4J_PREFIX}:${address}-${formula}-${relationship}`;

          const cache = await redis.get(key);
          if (cache) {
            debug("cache");
            return JSON.parse(cache);
          }

          const { records } = await jccard(address, formula, relationship);

          debug("args", address, formula, relationship);
          const data = [];
          records.forEach((record) => {
            const { _fields } = record;
            data.push({
              from: _fields[0],
              to: _fields[1],
              similarity: _fields[2],
            });
          });

          // EX seconds
          await redis.set(
            key,
            JSON.stringify(data),
            "EX",
            +process.env.REDIS_EXPIRE || 1 * 60
          );
          return data;
        } catch (error) {
          debug("error", error);
          throw error;
        }
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
});
