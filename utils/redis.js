const IORedis = require("ioredis");

const redis =
  process.env.REDIS_CLUSTER === "false"
    ? new IORedis(process.env.REDIS_HOST, process.env.REDIS_PORT)
    : new IORedis.Cluster(
        [
          {
            host: process.env.REDIS_HOST,
            port: process.env.REDIS_PORT,
          },
        ],
        {
          slotsRefreshTimeout: 3000,
          dnsLookup: (address, callback) => callback(null, address),
          redisOptions: {
            showFriendlyErrorStack: true,
            tls: {
              checkServerIdentity: (/*host, cert*/) => {
                return undefined;
              },
            },
          },
        }
      );

module.exports = redis;
