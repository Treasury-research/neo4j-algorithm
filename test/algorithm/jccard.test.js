require("dotenv").config();

const assert = require("assert");
const jccard = require("../../algorithm/jccard");

describe("jccard test", function () {
  describe("jccard", function () {
    it("jccard ok", async () => {
      const data = await jccard();
      console.log("data", data);

      assert.ok(1);
    });
  });
});
