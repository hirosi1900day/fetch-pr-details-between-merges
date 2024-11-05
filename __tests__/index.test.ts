import * as core from '@actions/core'
import { GitHubClient } from '../src/github-client'
import { PRDetailService } from '../src/pr-detail-service'
import { getPRDetailsBetweenMerges } from '../src/index'
import '../src/index'

jest.mock('@actions/github')
jest.mock('@actions/core')
jest.mock('../src/github-client')
jest.mock('../src/pr-detail-service')

describe('index', () => {
  let gitHubClientMock: jest.Mocked<GitHubClient>
  // let prDetailServiceMock: jest.Mocked<PRDetailService>

  beforeEach(() => {
    jest.clearAllMocks()
    gitHubClientMock = new GitHubClient(
      'test-token',
      'test-owner',
      'test-repo'
    ) as jest.Mocked<GitHubClient>
    // prDetailServiceMock = new PRDetailService(
    //   gitHubClientMock
    // ) as jest.Mocked<PRDetailService>
  })

  it('should fetch and output PR details', async () => {
    jest.spyOn(core, 'getInput').mockImplementation(name => {
      switch (name) {
        case 'github-token':
          return 'test-token'
        case 'repo-owner':
          return 'test-owner'
        case 'repo-name':
          return 'test-repo'
        case 'from-sha':
          return 'base-sha'
        case 'to-sha':
          return 'head-sha'
        default:
          return ''
      }
    })
    jest.spyOn(core, 'setOutput').mockImplementation(() => {})
    jest
      .spyOn(PRDetailService.prototype, 'getPRDetailsBetweenCommits')
      .mockResolvedValue({
        values: [
          {
            merge_user: 'merger_user1',
            pr_md_link: '<pr-url-1|PR Title 1>'
          }
        ]
      })
    await getPRDetailsBetweenMerges()

    expect(core.setOutput).toHaveBeenCalledWith(
      'pr-details',
      JSON.stringify({
        values: [
          {
            merge_user: 'merger_user1',
            pr_md_link: '<pr-url-1|PR Title 1>'
          }
        ]
      })
    )
  })
})
