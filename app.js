require("dotenv").config();

const restify = require("restify");
const { graphqlHTTP } = require("express-graphql");
const debug = require("debug")("app");
const { schema, rootValue } = require("./schema");
const jccard = require("./algorithm/jccard");

const app = restify.createServer();

app.get("/", (_req, res, _next) => {
  res.send("ok");
});

app.get("/test", async (_req, res, _next) => {
  const data = await jccard();
  res.send(data);
});

app.post(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: false,
  })
);

app.get(
  "/graphql",
  graphqlHTTP({
    schema,
    rootValue,
    graphiql: true,
  })
);

app.listen(process.env.APP_PORT ?? 3000, () => {
  debug(`Server is listening on port ${process.env.APP_PORT}`);
});
