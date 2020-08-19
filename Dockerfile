FROM node:latest

RUN apt-get update && \
    apt-get -y install chromium 

RUN useradd -ms /bin/bash -r -G audio,video sticker

COPY . /home/sticker

USER sticker

WORKDIR /home/sticker

RUN npm install puppeteer

RUN npm install

CMD npm start

EXPOSE 5000