const neo4j = require("neo4j-driver");
const driver = neo4j.driver(
  `neo4j://${process.env.NEO4J_HOST}`,
  neo4j.auth.basic(process.env.NEO4J_USER, process.env.NEO4J_PWD)
);

module.exports = driver;
