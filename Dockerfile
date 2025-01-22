FROM node:21-alpine

WORKDIR /app

COPY package.json ./

RUN yarn cache clean --force

RUN yarn

COPY . .

RUN npx prisma generate

RUN yarn run build


EXPOSE 3000

CMD ["yarn", "start"]
