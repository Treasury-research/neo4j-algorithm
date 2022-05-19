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
      socialConnect: { type: new GraphQLNonNull(SocialType) },
    },

    async resolve(_parent, args, _context) {
      try {
        /*
        const { address, socialConnect, limit, offset } = args;

        const arr = [
          "0x63254fb1f2dd46a16ea021b7e3fade19015d3d43",
          "0x83d7d8841067996ec07fd510baca8c4093169070",
          "0x310690519ba340fb089a685580ecfb3c0e208739",
          "0x7a6fa09f8064c546e78e4a8382b8ed2a0ddbead4",
          "0xe3867c92dafd18c5a5a4b66bfddfe9ca360570d6",
          "0xe5f81d2fc39eedd847bf325f265696a76d0e9a33",
          "0x533f39e078372d3d63a1e5cb8e77fdd52320cda3",
          "0xf27f5b344a4381d6e5605228adef8a1d1c277cb9",
          "0xc525d706e26314dfcea0194e66e76284410f24d7",
          "0xd5955e7d3ed9bdb479d52987273805c65b35ba0a",
          "0x0749a38dbfe04c31a3def914e09507caaf27819d",
          "0x0d5a855235bd8fe38057f89313200945ff212ee7",
          "0x1d98985a1a5244f84462d2becfb52a871f792864",
          "0x60be426023cbc8f0012f241f3068712411cfdf38",
          "0x66791b0107f789deb63d61e0b67592acaf9d316f",
          "0x03ddab1a7ea5fce375cc68abf03e6d642b5a6332",
          "0xc3e9c72e0d47ddd27e44fc8f4416f354b53736fe",
          "0x5c9a8f74126a3d9b324c2414b165ab86c403dc77",
          "0x9b52629843edcc082e8ad27be01bf01bed383804",
          "0xf3e863927c7acb08e72eefea23b054f904bacd49",
        ];

        const result = {
          total: arr.length >= 20 ? 20 : arr.length,
          data: [],
        };

        arr.forEach((item) => {
          result?.data.push({
            address: item,
          });
        });

        result.data = pagination(offset, limit, result.data);

        return result;

        */

        const { address, socialConnect, limit, offset } = args;
        const key = `${NEO4J_PREFIX}:${address}-${algorithm}-${socialConnect}-${limit}-${offset}`;

        debug("key", key);
        const cache = await redis.get(key);
        if (cache) {
          debug("cache");
          return JSON.parse(cache);
        }

        const { records } = await similarity(address, algorithm, socialConnect);

        debug("records %O", records);
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

        debug("result %O", result);
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
