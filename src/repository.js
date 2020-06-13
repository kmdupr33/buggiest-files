const { ResolvedBug } = require("./resolvedBug");
const { File } = require("./file");

class GithubRepository {
  constructor(owner, repo, githubApi, bugLabel) {
    this.owner = owner;
    this.repo = repo;
    this.githubApi = githubApi;
    this.bugLabel = bugLabel;
  }
  async resolvedBugs() {
    const issues = await this.getIssues();
    const resolvedBugs = await Promise.all(
      issues
        .filter(this.issuesThatDontInclude())
        .map(this.issuesToResolvedBugs())
    );
    return resolvedBugs.filter(
      (resolvedBug) => resolvedBug.filesToResolve.length > 0
    );
  }

  politePause() {
    return new Promise((resolve) => {
      setTimeout(resolve, 1000);
    });
  }

  async getIssues() {
    const issues = [];
    const pages = Array.apply(null, Array(100)).map(function (_, i) {
      return i + 1;
    });
    for (let page of pages) {
      await this.politePause();
      const response = await this.githubApi.issues.listForRepo({
        state: "closed",
        per_page: 100,
        owner: this.owner,
        repo: this.repo,
        page,
      });
      const { data } = response;
      if (data.length === 0) break;
      issues.push(...data);
    }
    return issues;
  }

  issuesToResolvedBugs() {
    return async ({ number, html_url }) => {
      const events = await this.getEventsForIssue(number);
      const [repoMergeCommit] = events
        .filter(({ event }) => event === "referenced")
        .filter(({ commit_url }) =>
          commit_url.includes(`${this.owner}/${this.repo}`)
        );
      if (!repoMergeCommit) {
        return new ResolvedBug([], "");
      }
      const commit = await this.getCommit(repoMergeCommit);
      return new ResolvedBug(
        commit.files.map(({ filename }) => new File(filename, commit.html_url)),
        html_url
      );
    };
  }

  async getCommit(repoMergeCommit) {
    return (
      await this.githubApi.repos.getCommit({
        url: repoMergeCommit.commit_url,
        ref: repoMergeCommit.commit_id,
        owner: this.owner,
        repo: this.repo,
      })
    ).data;
  }

  issuesThatDontInclude() {
    return ({ labels }) =>
      labels && labels.map(({ name }) => name).includes(this.bugLabel);
  }

  async getEventsForIssue(number) {
    return (
      await this.githubApi.issues.listEvents({
        issue_number: number,
        owner: this.owner,
        repo: this.repo,
      })
    ).data;
  }
}

module.exports = { GithubRepository };
