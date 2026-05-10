# 作業服注文システム フロントエンド

## 概要
Vue.js 3 + Vite の静的Webアプリ。
注文データは Power Automate HTTP トリガー（Webhook）に POST するだけで、
バックエンドサーバー・Azure AD登録・認証トークンは一切不要。

## セットアップ

1. `.env` を作成（`.env.example` を参照）
2. `npm install`
3. 開発: `npm run dev`
4. ビルド: `npm run build`

## 環境変数（`.env`）

```
VITE_WEBHOOK_URL=https://prod-xx.japaneast.logic.azure.com:443/workflows/xxxx/triggers/manual/paths/invoke?...
```

> Power Automate → HTTP トリガーの「HTTP POST の URL」をそのままコピーしてください。

## 社員リスト設定

`src/config/employees.js` にカードリーダーの認証番号と社員情報を追加してください。

```js
export default [
  { authNumber: 'ABC1234', name: '山田太郎', department: '製造1課' },
  ...
]
```

## 管理者側

SharePoint の「注文リスト」ビューを直接使用。
カスタムビューを作成してフィルタ・並び替えを設定することを推奨します。
