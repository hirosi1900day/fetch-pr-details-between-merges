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
  ): Promise<{ values: PRDetail[] }> {
    const commitsResponse = await this.gitHubClient.compareCommits(base, head)
    const commits = commitsResponse.data.commits

    const prDetails: PRDetail[] = []
    for (const commit of commits) {
      if (commit.parents && commit.parents.length > 1) {
        const pullRequests =
          await this.gitHubClient.listPRsAssociatedWithCommit(commit.sha)
        for (const pr of pullRequests.data) {
          const prDetailsResponse = await this.gitHubClient.getPRDetail(
            pr.number
          )
          const sanitizedTitle = pr.title.replace(/["`]/g, '')

          prDetails.push({
            merge_user: prDetailsResponse.data.merged_by?.login || '',
            pr_md_link: `<${pr.html_url}|${sanitizedTitle}>`
          })
        }
      }
    }

    return { values: prDetails }
  }
}
