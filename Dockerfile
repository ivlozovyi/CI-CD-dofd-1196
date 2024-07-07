FROM node

WORKDIR /server/

COPY . .

ENV CLIENT_PORT=3000

ENV PORT=5001

RUN npm install

COPY . /server/

