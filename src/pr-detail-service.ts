import { GitHubClient } from './github-client'
import { PRDetail } from './types'

export class PRDetailService {
  private gitHubClient: GitHubClient

  constructor(gitHubClient: GitHubClient) {
    this.gitHubClient = gitHubClient
  }

  async getPRDetailsBetweenCommits(
    base: string,
    head: string
  ): Promise<PRDetail[]> {
    const commitsResponse = await this.gitHubClient.compareCommits(base, head)
    const commits = commitsResponse.data.commits

    const prDetails: PRDetail[] = []
    for (const commit of commits) {
      if (commit.parents && commit.parents.length > 1) {
        const pullRequests =
          await this.gitHubClient.listPRsAssociatedWithCommit(commit.sha)
        pullRequests.data.forEach(pr => {
          prDetails.push({
            pr_number: pr.number,
            pr_title: pr.title,
            pr_author: pr.user?.login || '',
            commit_sha: commit.sha
          })
        })
      }
    }

    return prDetails
  }
}
