const { BugCounter } = require("./bugCounter");
const resolvedBugs = require("./resolvedBugs.json");

describe("bug counter", () => {
  it("counts bugs", async () => {
    const counter = new BugCounter();
    const count = await counter.count({
      resolvedBugs() {
        return Promise.resolve(resolvedBugs);
      },
    });
    expect(JSON.stringify(count)).toEqual();
  });
});
