FROM node:14.16.1

# RUN mkdir -p /usr/src/app

WORKDIR /usr/src/app

COPY package.json /usr/src/app/

RUN npm install \ && npm install tsc -g

COPY . .

EXPOSE  3000

CMD [ "npm" , "start" ]