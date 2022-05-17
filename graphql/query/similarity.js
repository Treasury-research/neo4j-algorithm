const { GraphQLNonNull, GraphQLString, GraphQLInt } = require("graphql");
const debug = require("debug")("app");

const ResultType = require("../type/result");
const { similarity } = require("../../algorithm/similarity");
const redis = require("../../utils/redis");
const { NEO4J_PREFIX, SIMILARITY } = require("../../constants");
const { pagination } = require("../../utils/array");
const SocialType = require("../type/social");

const similarityResolve = () => {
  return {
    JACCARD: handle(SIMILARITY.JACCARD),
    OVERLAP: handle(SIMILARITY.OVERLAP),
    // COSINE: handle(SIMILARITY.COSINE),
    // PEARSON: handle(SIMILARITY.PEARSON),
    // EUCLIDEANDISTANCE: handle(SIMILARITY.EUCLIDEANDISTANCE),
    // EUCLIDEAN: handle(SIMILARITY.EUCLIDEAN),
  };
};

const handle = (algorithm) => {
  return {
    type: ResultType,
    args: {
      address: { type: new GraphQLNonNull(GraphQLString) },
      limit: { type: GraphQLInt, defaultValue: 20 },
      offset: { type: GraphQLInt, defaultValue: 0 },
      socialConnect: { type: SocialType },
    },

    async resolve(_parent, args, _context) {
      try {
        const { address, socialConnect, limit, offset } = args;
        const key = `${NEO4J_PREFIX}:${address}-${algorithm}-${socialConnect}-${limit}-${offset}`;

        debug("key", key);
        const cache = await redis.get(key);
        if (cache) {
          debug("cache");
          return JSON.parse(cache);
        }

        const { records } = await similarity(address, algorithm, socialConnect);

        debug("args", address, socialConnect, socialConnect);
        const result = {
          total: records.length >= 20 ? 20 : records.length,
          data: [],
        };
        records.forEach((record) => {
          const { _fields } = record;
          result?.data.push({
            address: _fields[0],
          });
        });

        result.data = pagination(offset, limit, result.data);

        // EX seconds
        await redis.set(
          key,
          JSON.stringify(result),
          "EX",
          +process.env.REDIS_EXPIRE || 1 * 60
        );

        return result;
      } catch (error) {
        debug("error", error);
        throw error;
      }
    },
  };
};

module.exports = similarityResolve;
