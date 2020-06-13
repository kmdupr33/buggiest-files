const { Repository } = require("./repository");

class BugCounter {
  async count(repo) {
    const resolvedBugs = await repo.resolvedBugs();
    const statsByFileName = resolvedBugs.reduce((acc, curr) => {
      curr.filesToResolve.forEach((file) => {
        const stats = acc[file.path] ?? { total: 0, bugs: [] };
        stats.total++;
        stats.bugs.push(curr.bugUrl);
        acc[file.path] = stats;
      });
      return acc;
    }, {});
    return Object.keys(statsByFileName)
      .map((key) => ({
        file: key,
        ...statsByFileName[key],
      }))
      .sort((a, b) => b.total - a.total);
  }
}

module.exports = { BugCounter };
