import * as github from '@actions/github'
import * as core from '@actions/core'

interface PRDetail {
  pr_number: number // プルリクエストの番号
  pr_title: string // プルリクエストのタイトル
  pr_author: string // プルリクエストの作者
  commit_sha: string // 関連するコミットのSHA
}

/**
 * 指定された2つのマージコミット間のPR情報を抜き出します。
 */
async function getPRDetailsBetweenMerges(): Promise<void> {
  try {
    
    const token: string = core.getInput('github-token')
    const owner: string = core.getInput('repo-owner')
    const repo: string = core.getInput('repo-name')
    const base: string = core.getInput('from-sha')
    const head: string = core.getInput('to-sha')

    core.debug(`Fetching PR details between ${base} and ${head}`)
    
    const octokit = github.getOctokit(token)
    // 2つのSHA間のコミットを比較して取得
    const { data: commits } = await octokit.rest.repos.compareCommits({
      owner,
      repo,
      base,
      head
    })
    
    // デバッグ
    core.debug(`Commits between ${base} and ${head}: ${commits.commits.length}`)

    const prDetails: PRDetail[] = []

    // 各コミットについて処理
    for (const commit of commits.commits) {
      // マージコミットかどうかを確認
      core.debug(`Checking commit ${commit.sha}`)
      if (commit.parents && commit.parents.length > 1) {
        // コミットに関連するPRを取得
        core.debug(`Fetching PRs associated with commit ${commit.sha}`)
        throw new Error(`Not implemented: ${commit.sha}, ${commit.parents}`)
        const { data: pullRequests } =
          await octokit.rest.repos.listPullRequestsAssociatedWithCommit({
            owner,
            repo,
            commit_sha: commit.sha
          })
          
          core.debug(`Found ${pullRequests.length} PRs associated with commit ${commit.sha}`)
        // 取得したPRの情報を抽出
        pullRequests.forEach(pr => {
          prDetails.push({
            pr_number: pr.number,
            pr_title: pr.title,
            pr_author: pr.user?.login || '',
            commit_sha: commit.sha
          })
        })
      }
    }
  } catch (error) {
    // エラーが発生した場合は失敗を報告
    if (error instanceof Error) {
      core.setFailed(`Error fetching PR details: ${error.message}`)
    }
    core.setFailed(`Error fetching PR details:`)
  }
}
// 環境変数からパラメータを取得して関数を実行
getPRDetailsBetweenMerges()
