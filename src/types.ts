export interface PRDetail {
  pr_number: number // プルリクエストの番号
  pr_title: string // プルリクエストのタイトル
  pr_author: string // プルリクエストの作者
  commit_sha: string // 関連するコミットのSHA
  pr_md_link: string // プルリクエストのリンク
}
