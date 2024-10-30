import { GitHubClient } from '../src/github-client'
import * as github from '@actions/github'

jest.mock('@actions/github', () => ({
  getOctokit: jest.fn().mockReturnValue({
    rest: {
      repos: {
        compareCommits: jest.fn(),
        listPullRequestsAssociatedWithCommit: jest.fn()
      },
      pulls: {
        get: jest.fn()
      }
    }
  })
}))

describe('GitHubClient', () => {
  const token = 'test-token'
  const owner = 'test-owner'
  const repo = 'test-repo'
  let gitHubClient: GitHubClient

  beforeEach(() => {
    gitHubClient = new GitHubClient(token, owner, repo)
  })

  it('should call compareCommits with correct parameters', async () => {
    const base = 'base-sha'
    const head = 'head-sha'

    await gitHubClient.compareCommits(base, head)
    expect(
      github.getOctokit(token).rest.repos.compareCommits
    ).toHaveBeenCalledWith({
      owner,
      repo,
      base,
      head
    })
  })

  it('should call listPullRequestsAssociatedWithCommit with correct commit SHA', async () => {
    const commitSha = 'commit-sha'

    await gitHubClient.listPRsAssociatedWithCommit(commitSha)
    expect(
      github.getOctokit(token).rest.repos.listPullRequestsAssociatedWithCommit
    ).toHaveBeenCalledWith({
      owner,
      repo,
      commit_sha: commitSha
    })
  })

  it('should retrieve pull request details for a given pull number', async () => {
    const pullNumber = 123

    await gitHubClient.getPRDetail(pullNumber)
    expect(github.getOctokit(token).rest.pulls.get).toHaveBeenCalledWith({
      owner,
      repo,
      pull_number: pullNumber
    })
  })
})
