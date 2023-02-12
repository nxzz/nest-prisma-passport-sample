# Backend

Nest.js + Prisma + Passport(local + JWT + RefreshToken) のテンプレート

## License
MIT

## フレームワーク

- nest https://nestjs.com/
- prisma https://www.prisma.io/

## はじめかた

1. `docker-compose up`
1. `cd app && npm install`
1. `npm run start:dev`


## 実装してあるもの
1. ユーザ
    1. 新規登録API
    1. 管理者用全ユーザ取得API
1. 認証
    1. ID/PWのログインとJWT、リフレッシュトークンの発行
    1. JWTでの認証
    1. リフレッシュトークンまわり（リフレッシュAPI）

## 主なファイルの類
### DB
1. `./db/init/01-initdb.sql` - DBのイニシャライズ用、基本触らない
1. `./app/prisma/schema.prisma` - DB定義
1. `./seed/seed.ts` - シーダー
1. `./app/src/modules/prisma/repository/*.ts` - リポジトリ、テーブルを増やしたら増やすこと

### モジュール
1. `./app/src/modules/admin/` - 管理画面用API
1. `./app/src/modules/auth/` - 認証系API
1. `./app/src/modules/web/` - ユーザ用API（空）

## 開発用ツール

- http://localhost:8081 で phpMyAdmin (db 操作ツール)が動作

## DB関係コマンドメモ

- まず、 `./seed` で `npm install` すること
- seed 投入 `npx prisma migrate reset -f && cd ../seed && ts-node ./seed.ts`
- DB 初期化 `npx prisma migrate reset -f`
- prisma の定義を変更したら `npx prisma migrate reset -f && npx prisma generate dev && npx prisma migrate dev && cd ../seed && ts-node ./seed.ts` で再生成

## Todo

直したけどよい方法がない問題、対応策募集中

- prisma のスキーマを複数ファイルに分割したい
  - prisma-merge, prismix などで単純に結合はできる
  - 補完が効かなくなる
  - https://github.com/prisma/prisma/issues/2377 プロジェクト作成時点では対応が協議中
