FROM node:18.3.0-alpine as nest-build
WORKDIR /app/
COPY . /app/
RUN npm i --no-progress
RUN npx prisma generate
RUN npx nest build

FROM node:18.3.0-alpine
WORKDIR /app/
COPY ./.npmrc /app/.npmrc
COPY ./package.json /app/package.json
COPY ./package-lock.json /app/package-lock.json
COPY ./prisma/schema.prisma /app/prisma/schema.prisma
RUN npm i --no-progress --production --cache /tmp/empty-cache &&\
    rm -rf /tmp/empty-cache &&\
    rm -rf node_modules/@prisma/engines &&\
    rm -rf node_modules/prisma/*.node &&\
    rm -rf /root/.cache && rm -rf /root/.npm &&\
    find ./ -name "*.ts" -delete &&\
    find ./ -name "*.map" -delete &&\
    find ./ -name "*.md" -delete &&\
    find ./ -name "license" -delete &&\
    find ./ -name "LICENSE" -delete
# RUN npm uninstall -g npm
COPY --from=nest-build /app/dist /app/dist

CMD ["node", "--enable-source-maps", "dist/main.js"]
