# Backend

## フレームワーク

- nest https://nestjs.com/
- prisma https://www.prisma.io/

## はじめかた

1. docker-compose up
1. cd app && npm install
1. npm start
1. echo 'enjoy!'

## 開発用ツール

- http://localhost:3030 で phpMyAdmin (db 操作ツール)が動作

## memo

- seed 投入 `npx prisma migrate reset -f && cd ../seed && ts-node ./seed.ts`
- DB 初期化 `npx prisma migrate reset -f`
- prisma の定義を変更したら `npx prisma migrate reset -f && npx prisma generate dev && npx prisma migrate dev && cd ../seed && ts-node ./seed.ts` で再生成

- `docker run -v $(pwd)/app:/work/ -it node:lts-alpine3.15 /bin/sh`

## Todo

直したけどよい方法がない問題、対応策募集中

- prisma のスキーマを複数ファイルに分割したい
  - prisma-merge, prismix などで単純に結合はできる
  - 補完が効かなくなる
  - https://github.com/prisma/prisma/issues/2377 プロジェクト作成時点では対応が協議中
