<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app
※本アプリは、Google AIコースの最終課題として実装した自身初のAIプロジェクトです


This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/3b7f0087-5cd8-4874-9bfa-d4690101092d

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Set the `GEMINI_API_KEY` in [.env.local](.env.local) to your Gemini API key
3. Run the app:
   `npm run dev`


## 概要 (Overview)
## 技術スタック (Tech Stack)
＊＊フロントエンド:
React: UI構築のメインライブラリ
TypeScript: 安全で堅牢なコード開発
素早く: 高速な開発環境とビルドツール
＊＊スタイリング:
＊Tailwind CSS: 柔軟でモダンなデザイン
＊フレーマーモーション: 流れるようなアニメーション効果
＊ルシド・リアクト: シンプルで洗練されたアイコン
＊＊AI:
＊Gemini API（Google GenAI）: 最新のAIモデルによるデータ分析とテキスト生成
＊＊グラフ・データ:
＊チャートの再作成: インタラクティブなチャート表示
＊日付関数: 日付操作の効率化
＊＊インフラ/その他:
LocalStorage API: サーバーレスでのデータ永続化


## 主な機能 (Features)
＊＊AI体重予想 & アドバイス: 直近の体重トレンドやトレーニング内容、ユーザープロフィール（BMI・体脂肪率など）を分析し、明日の予想体重とカジュアルなフィードバックを生成します。
＊＊ダッシュボード: 現在の体重、目標体重、BMI、推定体脂肪率を一目で確認できます。
＊＊体重記録 & グラフ: 日々の体重とトレーニング内容（回数、時間など）を記録し、視覚的なチャートで進捗を確認できます。
＊＊モチベーションバナー: 目標までの残り体重を表示し、状況に合わせた応援メッセージを表示します。
＊＊プロフィール設定: 身長、年齢、性別、目標体重を設定することで、より精度の高い分析を可能にします。
＊＊ローカル保存: データはブラウザのLocalStorageに保存されるため、アカウント作成不要ですぐに使い始められます。

## 使い方 (How to use)
＊＊プロフィール設定: 画面下部の「プロフィール設定」で身長・年齢・性別・目標体重を入力します。
＊＊体重を記録: 毎日（または運動後）に「ログを追加」から現在の体重と、必要なら運動内容を入力します。
＊＊AI分析を確認: ダッシュボードやAIセクションを確認し、AIによる予想体重と「明日のワンポイントアドバイス」をチェックします。
＊＊グラフで振り返り: 過去の推移をチャートで確認し、日々の変化を楽しみながら継続します。
