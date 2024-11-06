import { GitHubClient } from './github-client'
import { PRDetail } from './types'

export class PRDetailService {
  private gitHubClient: GitHubClient

  constructor(gitHubClient: GitHubClient) {
    this.gitHubClient = gitHubClient
  }

  async getPRDetailsBetweenCommits(
    base: string,
    head: string,
    options: {
      includePRNumber?: boolean
      includeCommitSha?: boolean
      includeTitle?: boolean
      includeAuthor?: boolean
      includeMergeUser?: boolean
      includeMdLink?: boolean
    } = {}
  ): Promise<{ values: PRDetail[] }> {
    const commitsResponse = await this.gitHubClient.compareCommits(base, head)
    const commits = commitsResponse.data.commits

    const prDetails: PRDetail[] = []
    for (const commit of commits) {
      // スカッシュマージの場合、コミットメッセージにPR番号が含まれている
      const prNumberMatch = commit.commit.message.match(/\s+\(#(\d+)\)$/)

      if ((commit.parents && commit.parents.length > 1) || prNumberMatch) {
        const pullRequests =
          await this.gitHubClient.listPRsAssociatedWithCommit(commit.sha)
        for (const pr of pullRequests.data) {
          const prDetailsResponse = await this.gitHubClient.getPRDetail(
            pr.number
          )
          const sanitizedTitle = pr.title.replace(/["`]/g, '')

          // Conditionally build the PR detail object based on options
          const prDetail: PRDetail = {}

          if (options.includePRNumber) {
            prDetail.pr_number = pr.number
          }
          if (options.includeCommitSha) {
            prDetail.commit_sha = commit.sha
          }
          if (options.includeTitle) {
            prDetail.pr_title = sanitizedTitle
          }
          if (options.includeAuthor) {
            prDetail.pr_author = pr.user?.login || ''
          }
          if (options.includeMergeUser) {
            prDetail.merge_user = prDetailsResponse.data.merged_by?.login || ''
          }
          if (options.includeMdLink) {
            prDetail.pr_md_link = `<${pr.html_url}|${sanitizedTitle}>`
          }

          prDetails.push(prDetail)
        }
      }
    }

    return { values: prDetails }
  }
}
