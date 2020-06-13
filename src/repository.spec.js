const { GithubRepository } = require("./repository");
const { Octokit } = require("@octokit/rest");

describe("GithubRepository", () => {
  it("gets resolved bugs", async () => {
    const repo = new GithubRepository(
      "facebook",
      "react",
      new Octokit({ auth: process.env.GITHUB_AUTH_TOKEN }),
      "Type: Bug"
    );
    const bugs = await repo.resolvedBugs();
    expect(JSON.stringify(bugs)).toEqual("");
  }, 999999900);
});
