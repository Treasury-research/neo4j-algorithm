const debug = require("debug")("app");
const driver = require("../utils/neo4j");

const similarity = async (address, formula, relationship) => {
  const cypher = `
  MATCH (addr1:Addr {address: '${address.toLowerCase()}'})-[:${relationship}]->(event1)
  WITH addr1, collect(id(event1)) AS add1Event
  MATCH (addr2:Addr)-[:${relationship}]->(event2) WHERE addr1 <> addr2
  WITH addr1, add1Event, addr2, collect(id(event2)) AS add2Event
  RETURN
       addr2.address AS address,
       gds${
        process.env.NEO4J_ALPHA === "1" ? ".alpha." : "."
      }similarity.${formula.toLowerCase()}(add1Event, add2Event) AS similarity
  ORDER BY similarity DESC limit 20`;
  debug("cypher", cypher);
  const result = await driver
    .session({
      database: process.env.NEO4J_DATABASE || "neo4j",
    })
    .run(cypher);

  return result;
};

module.exports = {
  similarity,
};
