# Fetch PR Details Between Merges Action

このGitHub Actionは、リポジトリ内の2つの指定されたマージコミット間で、すべてのプ
ルリクエストの詳細を取得します。取得する情報には、プルリクエスト番号、タイトル、
コミットSHA、作成者、マージされたタイムスタンプが含まれます。

## インプット

| インプット名   | 説明                                         | 必須   | デフォルト                            |
| -------------- | -------------------------------------------- | ------ | ------------------------------------- |
| `github-token` | GitHub APIへの認証に使用するGitHubトークン。 | いいえ | `${{ github.token }}`                 |
| `repo-owner`   | リポジトリの所有者（ユーザーまたは組織）。   | いいえ | `${{ github.repository_owner }}`      |
| `repo-name`    | Actionを実行するリポジトリの名前。           | いいえ | `${{ github.event.repository.name }}` |
| `from-sha`     | 最初のマージコミットのSHA。                  | はい   | N/A                                   |
| `to-sha`       | 2番目のマージコミットのSHA。                 | はい   | N/A                                   |

### インプットの詳細

- **`github-token`**: GitHub APIへの認証に使用するトークン。指定しない場合、デ
  フォルトの`${{ github.token }}`が使用されます。
- **`repo-owner`**: リポジトリの所有者。ワークフローがトリガーされたリポジトリの
  所有者がデフォルトです。
- **`repo-name`**: このActionが実行されるリポジトリ名。デフォルトは現在のリポジ
  トリ名です。
- **`from-sha`**: プルリクエスト取得を開始する最初のマージコミットのSHA。このイ
  ンプットは必須です。
- **`to-sha`**: プルリクエスト取得を終了する2番目のマージコミットのSHA。このイン
  プットは必須です。

## アウトプット

| アウトプット名 | 説明                                                                                                                                   |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `pr-details`   | 指定されたコミット間のすべてのプルリクエストの詳細を含むJSON形式の文字列。各プルリクエストオブジェクトのフォーマットは以下の通りです： |
|                | - `"merge_user"`: プルリクエストをマージしたユーザー名 　　　　　　　　　　　　　　                                                    |
|                | - `"pr_md_url"`: PRのurlとPRのtitleのマークダウン                                                                                      |

### アウトプットの例

```json
[
  {
    "merge_user": "johndoe",
    "pr_md_url": "<https://github.com/<organization>/<repository>/pull/123|Fix login issue>"
  },
  {
    "merge_user": "johndoe",
    "pr_md_url": "<https://github.com/<organization>/<repository>/pull/124|Add new feature for handling API requests>"
  }
]
```

## ワークフロー使用例

以下の参考にしてください
https://github.com/hirosi1900day/fetch-pr-details-between-merges/blob/main/.github/workflows/example_ci.yml
