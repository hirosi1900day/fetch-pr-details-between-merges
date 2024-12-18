import * as core from '@actions/core'
import { GitHubClient } from './github-client'
import { PRDetailService } from './pr-detail-service'

/**
 * Main function to extract and output PR details.
 */
export async function getPRDetailsBetweenMerges(): Promise<void> {
  try {
    const token: string = core.getInput('github-token')
    const owner: string = core.getInput('repo-owner')
    const repo: string = core.getInput('repo-name')
    const base: string = core.getInput('from-sha')
    const head: string = core.getInput('to-sha')
    const includePRNumber: boolean =
      core.getInput('include-pr-number') === 'true'
    const includeCommitSha: boolean =
      core.getInput('include-commit-sha') === 'true'
    const includeTitle: boolean = core.getInput('include-title') === 'true'
    const includeAuthor: boolean = core.getInput('include-author') === 'true'
    const includeMergeUser: boolean =
      core.getInput('include-merge-user') === 'true'
    const includeMdLink: boolean = core.getInput('include-md-link') === 'true'

    const gitHubClient = new GitHubClient(token, owner, repo)
    const prDetailService = new PRDetailService(gitHubClient)

    core.debug(`Fetching PR details between ${base} and ${head}`)
    const prDetails = await prDetailService.getPRDetailsBetweenCommits(
      base,
      head,
      {
        includePRNumber,
        includeCommitSha,
        includeTitle,
        includeAuthor,
        includeMergeUser,
        includeMdLink
      }
    )

    // Output the extracted PR details
    core.setOutput('pr-details', JSON.stringify(prDetails))
  } catch (error) {
    if (error instanceof Error) {
      core.setFailed(`Error fetching PR details: ${error.message}`)
    }
  }
}

// eslint-disable-next-line @typescript-eslint/no-floating-promises
getPRDetailsBetweenMerges()
