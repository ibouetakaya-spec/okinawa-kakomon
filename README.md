# 沖縄県中学校 過去問検索

## 🚀 Vercel への公開手順

### 1. Node.js をインストール（まだの場合）
https://nodejs.org からダウンロード（LTS版を選ぶ）

### 2. GitHub にアップロード
1. https://github.com でアカウント作成
2. 「New repository」→ リポジトリ名を入力（例: okinawa-kakomon）
3. このフォルダの中身をすべてアップロード

### 3. Vercel でデプロイ
1. https://vercel.com でアカウント作成（GitHubでログインが楽）
2. 「New Project」→ GitHubのリポジトリを選択
3. 設定はそのままで「Deploy」を押すだけ！
4. 数分で `https://okinawa-kakomon.vercel.app` のようなURLが発行される

### 4. 独自ドメインを設定（任意）
- Vercel の「Settings > Domains」から設定可能
- お名前.com などで取得したドメインを紐づけられる

---

## 💰 Google AdSense の設置

審査が通ったら `index.html` の以下のコメントを外してコードを貼る：

```html
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-あなたのID" crossorigin="anonymous"></script>
```

また `src/App.jsx` 内の `AdBanner` コンポーネントを AdSense の `<ins>` タグに置き換える。

---

## 🛠 ローカルで動かす方法

```bash
npm install
npm run dev
```

ブラウザで http://localhost:5173 を開く

## ビルド（本番用）

```bash
npm run build
```
