# Fetch PR Details Between Merges Action

このGitHub Actionは、リポジトリ内の2つの指定されたマージコミット間で、すべてのプ
ルリクエストの詳細を取得します。取得する情報には、プルリクエスト番号、タイトル、
コミットSHA、作成者、マージしたユーザー、マークダウン形式のリンクが含まれ、各項
目はカスタマイズ可能です。

## インプット

| インプット名         | 説明                                                   | 必須   | デフォルト                            |
| -------------------- | ------------------------------------------------------ | ------ | ------------------------------------- |
| `github-token`       | GitHub APIへの認証に使用するGitHubトークン。           | いいえ | `${{ github.token }}`                 |
| `repo-owner`         | リポジトリの所有者（ユーザーまたは組織）。             | いいえ | `${{ github.repository_owner }}`      |
| `repo-name`          | Actionを実行するリポジトリの名前。                     | いいえ | `${{ github.event.repository.name }}` |
| `from-sha`           | 最初のマージコミットのSHA。                            | はい   | N/A                                   |
| `to-sha`             | 2番目のマージコミットのSHA。                           | はい   | N/A                                   |
| `include-pr-number`  | プルリクエスト番号を出力に含めるか。                   | いいえ | `true`                                |
| `include-commit-sha` | コミットSHAを出力に含めるか。                          | いいえ | `true`                                |
| `include-title`      | プルリクエストのタイトルを出力に含めるか。             | いいえ | `true`                                |
| `include-author`     | プルリクエストの作成者を出力に含めるか。               | いいえ | `true`                                |
| `include-merge-user` | プルリクエストをマージしたユーザーを出力に含めるか。   | いいえ | `true`                                |
| `include-md-link`    | プルリクエストへのマークダウンリンクを出力に含めるか。 | いいえ | `true`                                |

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
- **`include-*` オプション**: 出力に含める項目を指定できます。必要に応じ
  て`true`または`false`に設定してください。

## アウトプット

| アウトプット名 | 説明                                                                                                                                   |
| -------------- | -------------------------------------------------------------------------------------------------------------------------------------- |
| `pr-details`   | 指定されたコミット間のすべてのプルリクエストの詳細を含むJSON形式の文字列。各プルリクエストオブジェクトのフォーマットは以下の通りです： |

### アウトプットのフォーマット

各プルリクエストオブジェクトは、指定されたオプションに応じて以下のフィールドを含
みます：

- `"number"`: プルリクエストの番号。
- `"title"`: プルリクエストのタイトル。
- `"sha"`: プルリクエストのコミットSHA。
- `"author"`: プルリクエストの作成者のGitHubユーザー名。
- `"merge_user"`: プルリクエストをマージしたユーザー名。
- `"pr_md_link"`: PRのURLとPRのタイトルのマークダウンリンク形式。

### アウトプットの例

```json
[
  {
    "number": 123,
    "title": "Fix login issue",
    "sha": "abcd1234efgh5678ijkl9101mnopqrstuvwx",
    "author": "johndoe",
    "merge_user": "johndoe",
    "pr_md_link": "<https://github.com/<organization>/<repository>/pull/123|Fix login issue>"
  },
  {
    "number": 124,
    "title": "Add new feature for handling API requests",
    "sha": "wxyz5678abcd9101efgh2345ijklmnopqrst",
    "author": "janedoe",
    "merge_user": "johndoe",
    "pr_md_link": "<https://github.com/<organization>/<repository>/pull/124|Add new feature for handling API requests>"
  }
]
```

## ワークフロー使用例

以下の参考にしてください
https://github.com/hirosi1900day/fetch-pr-details-between-merges/blob/main/.github/workflows/example_ci.yml
