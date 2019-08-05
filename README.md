# studio.design Form Notifier

## Usage

1. プロジェクトのセットアップ
    ```sh
    $ git clone https://github.com/munky69rock/gas-studio-form-notifier-to-slack
    $ npm i @google/clasp -g
    $ yarn install
    ```
2. https://script.google.com/ にアクセスし、新規スクリプトを作成
3. 「ファイル > プロジェクトのプロパティ」からスクリプトIDをコピー
4.  `clasp clone` を実行する
    ```
    $ clasp clone "1m2K...." --rootDir=./src # 先ほどコピーしたスクリプトIDを指定
    $ git checkout src/appsscript.json
    $ rm src/コード.js
    ```
5. スクリプト編集画面の「ファイル > プロジェクトのプロパティ > スクリプトのプロパティ」に `SLACK_WEBHOOK_URL` と `GMAIL_SEARCH_QUERY`(ex: `to:studio@example.com AND subject:"Your form is submitted"`) を設定
6. `clasp push`を実行
  ```sh
  $ clasp push
  ```
7. スクリプト編集画面の「実行 > 関数を実行 > main」を実行し、権限の許可を実行する
8. スクリプト編集画面の「編集 > 現在のプロジェクトのトリガー」をクリック、新しいトリガーを作成する
9. 実行する関数に `main`、時間ベースのトリガーのタイプを選択で`分ベースのタイマー`、時間の間隔を選択（分）で`１分おき`を選択し保存
