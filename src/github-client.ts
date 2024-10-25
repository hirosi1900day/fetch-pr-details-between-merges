import * as github from '@actions/github'

export class GitHubClient {
  private octokit: ReturnType<typeof github.getOctokit>
  private owner: string
  private repo: string

  constructor(token: string, owner: string, repo: string) {
    this.octokit = github.getOctokit(token)
    this.owner = owner
    this.repo = repo
  }

  async compareCommits(base: string, head: string) {
    return this.octokit.rest.repos.compareCommits({
      owner: this.owner,
      repo: this.repo,
      base,
      head
    })
  }

  async listPRsAssociatedWithCommit(commitSha: string) {
    return this.octokit.rest.repos.listPullRequestsAssociatedWithCommit({
      owner: this.owner,
      repo: this.repo,
      commit_sha: commitSha
    })
  }
}
