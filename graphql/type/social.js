const { GraphQLEnumType } = require("graphql");

const SocialType = new GraphQLEnumType({
  name: "Social",
  values: {
    RSS3_Follow: { value: "FOLLOW{source:'rss3'}" },
    Cyberconnect_Follow: { value: "FOLLOW{source:'CyberConnect'}" },
    Poap: { value: "ATTEND" },
  }, // FOLLOW || ATTEND
});

module.exports = SocialType;
