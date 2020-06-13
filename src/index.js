#!/usr/bin/env node
const { GithubRepository } = require("./repository");
const { BugCounter } = require("./bugCounter");
const { Octokit } = require("@octokit/rest");

require("yargs")
  .scriptName("buggiest-files")
  .usage("$0 <cmd> [args]")
  .command(
    "get",
    "gets the buggiest files in a repo",
    (yargs) => {
      yargs.option("token", {
        type: "string",
        describe:
          "your github personal access token (required for private repos or if you run into rate limits)",
      });
      yargs.option("owner", {
        require: true,
        type: "string",
        describe: "the owner of the repo",
      });
      yargs.option("repo", {
        require: true,
        type: "string",
        describe: "the name of the repo",
      });
      yargs.option("bugLabel", {
        type: "string",
        default: "bug",
        describe: "the label used to tag issues as bugs",
      });
    },
    async function ({ token, owner, repo, bugLabel }) {
      const repository = new GithubRepository(
        owner,
        repo,
        new Octokit({ auth: token }),
        bugLabel
      );
      const bugCounter = new BugCounter();
      const count = await bugCounter.count(repository);
      console.log(JSON.stringify(count, null, 2));
    }
  )
  .help().argv;
