FROM node:latest

RUN apt-get update && \
    apt-get -y install chromium 

# RUN useradd -ms /bin/bash -r -G audio,video sticker

WORKDIR /usr/src/app

COPY . /home/src/app

RUN npm install puppeteer

RUN npm ci --production

CMD npm run start:prod

EXPOSE 5000