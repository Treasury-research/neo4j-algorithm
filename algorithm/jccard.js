const driver = require("../utils/neo4j");

const jccard = async () => {
  const cypher = `match (a) return a limit 5`;
  const result = await driver
    .session({
      database: process.env.NEO4J_DATABASE || "neo4j",
    })
    .run(cypher);

  return result;
};

module.exports = jccard;
