require("dotenv").config();

const express = require("express");
const { graphqlHTTP } = require("express-graphql");
const debug = require("debug")("app");
cors = require("cors");
const schema = require("./graphql/schema");

const app = express();
app.use(cors());

app.get("/", (_req, res, _next) => {
  res.send("ok");
});

app.use(
  "/graphql",
  graphqlHTTP({
    schema,
    graphiql: true,
  })
);

app.listen(process.env.APP_PORT ?? 3000, () => {
  debug(`Server is listening on port ${process.env.APP_PORT}`);
});
