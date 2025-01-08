FROM node:22-alpine

WORKDIR /app

COPY package.json ./

RUN npm cache clean --force

RUN npm install

COPY . .

RUN npx prisma generate

RUN npm run build


EXPOSE 3000

CMD ["npm", "start"]
