import { PRDetailService } from '../src/pr-detail-service'
import { GitHubClient } from '../src/github-client'

jest.mock('../src/github-client')

describe('PRDetailService', () => {
  let gitHubClientMock: jest.Mocked<GitHubClient>
  let prDetailService: PRDetailService

  beforeEach(() => {
    gitHubClientMock = new GitHubClient(
      'test-token',
      'test-owner',
      'test-repo'
    ) as jest.Mocked<GitHubClient>
    prDetailService = new PRDetailService(gitHubClientMock)
  })

  it('should return PR details between commits', async () => {
    const base = 'base-sha'
    const head = 'head-sha'
    const mockCommits = [
      {
        sha: 'commit-sha-1',
        parents: [{}, {}]
      },
      {
        sha: 'commit-sha-2',
        parents: [{}, {}]
      }
    ]
    const mockPullRequests = [
      {
        number: 1,
        title: 'PR Title 1',
        user: { login: 'author1' }
      },
      {
        number: 2,
        title: 'PR Title 2',
        user: { login: 'author2' }
      }
    ]

    gitHubClientMock.compareCommits.mockResolvedValue({
      data: { commits: mockCommits }
    } as any)
    gitHubClientMock.listPRsAssociatedWithCommit.mockResolvedValue({
      data: mockPullRequests
    } as any)

    const prDetails = await prDetailService.getPRDetailsBetweenCommits(
      base,
      head
    )

    expect(prDetails).toEqual({
      values: [
        {
          pr_number: 1,
          pr_title: 'PR Title 1',
          pr_author: 'author1',
          commit_sha: 'commit-sha-1'
        },
        {
          pr_number: 2,
          pr_title: 'PR Title 2',
          pr_author: 'author2',
          commit_sha: 'commit-sha-1'
        },
        {
          pr_number: 1,
          pr_title: 'PR Title 1',
          pr_author: 'author1',
          commit_sha: 'commit-sha-2'
        },
        {
          pr_number: 2,
          pr_title: 'PR Title 2',
          pr_author: 'author2',
          commit_sha: 'commit-sha-2'
        }
      ]
    })
  })
})
