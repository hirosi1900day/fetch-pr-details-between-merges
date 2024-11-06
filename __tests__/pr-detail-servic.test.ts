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
        parents: [{}, {}],
        commit: { message: 'commit message 1' }
      },
      {
        sha: 'commit-sha-2',
        parents: [{}, {}],
        commit: { message: 'commit message 2' }
      }
    ]
    const mockPullRequests = [
      {
        number: 1,
        title: 'PR Title 1',
        user: { login: 'author1' },
        html_url: 'pr-url-1'
      },
      {
        number: 2,
        title: 'PR Title 2',
        user: { login: 'author2' },
        html_url: 'pr-url-2'
      }
    ]
    const mockPRDetailsResponse = {
      merged_by: { login: 'merger' }
    }

    gitHubClientMock.compareCommits.mockResolvedValue({
      data: { commits: mockCommits }
    } as any)
    gitHubClientMock.listPRsAssociatedWithCommit.mockResolvedValue({
      data: mockPullRequests
    } as any)
    gitHubClientMock.getPRDetail.mockResolvedValue({
      data: mockPRDetailsResponse
    } as any)

    const prDetails = await prDetailService.getPRDetailsBetweenCommits(
      base,
      head,
      {
        includePRNumber: true,
        includeCommitSha: true,
        includeTitle: true,
        includeAuthor: true,
        includeMergeUser: true,
        includeMdLink: true
      }
    )

    expect(prDetails).toEqual({
      values: [
        {
          pr_number: 1,
          pr_title: 'PR Title 1',
          pr_author: 'author1',
          merge_user: 'merger',
          commit_sha: 'commit-sha-1',
          pr_md_link: '<pr-url-1|PR Title 1>'
        },
        {
          pr_number: 2,
          pr_title: 'PR Title 2',
          pr_author: 'author2',
          merge_user: 'merger',
          commit_sha: 'commit-sha-1',
          pr_md_link: '<pr-url-2|PR Title 2>'
        },
        {
          pr_number: 1,
          pr_title: 'PR Title 1',
          pr_author: 'author1',
          merge_user: 'merger',
          commit_sha: 'commit-sha-2',
          pr_md_link: '<pr-url-1|PR Title 1>'
        },
        {
          pr_number: 2,
          pr_title: 'PR Title 2',
          pr_author: 'author2',
          merge_user: 'merger',
          commit_sha: 'commit-sha-2',
          pr_md_link: '<pr-url-2|PR Title 2>'
        }
      ]
    })
  })
})
