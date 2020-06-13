const { File } = require("./file");
class ResolvedBug {
  constructor(filesToResolve, bugUrl) {
    this.filesToResolve = filesToResolve;
    this.bugUrl = bugUrl;
  }
}

module.exports = { ResolvedBug };
