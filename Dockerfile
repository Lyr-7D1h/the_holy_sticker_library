# FROM node:12-slim
FROM node:12-alpine AS build
# Run with --init arg to reap zombie processes.

# Install latest chrome dev package and fonts to support major charsets (Chinese, Japanese, Arabic, Hebrew, Thai and a few others)
# Note: this installs the necessary libs to make the bundled version of Chromium that Puppeteer
# installs, work.
# RUN apt-get update \
#     && apt-get install -y wget gnupg \
#     && wget -q -O - https://dl-ssl.google.com/linux/linux_signing_key.pub | apt-key add - \
#     && sh -c 'echo "deb [arch=amd64] http://dl.google.com/linux/chrome/deb/ stable main" >> /etc/apt/sources.list.d/google.list' \
#     && apt-get update \
#     && apt-get install -y google-chrome-stable fonts-ipafont-gothic fonts-wqy-zenhei fonts-thai-tlwg fonts-kacst fonts-freefont-ttf libxss1 \
#       --no-install-recommends \
#     && rm -rf /var/lib/apt/lists/*

# Installs latest Chromium (85) package.
RUN apk add --no-cache \
      chromium \
      nss \
      freetype \
      freetype-dev \
      harfbuzz \
      ca-certificates \
      ttf-freefont \
      bash

ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD true

COPY . /

RUN npm run build

# RUN rm -rf /server/node_modules
RUN rm -rf /server/src

# Minimized version without source code 
FROM build 

WORKDIR /usr/src/app

COPY --from=build /server server
COPY --from=build /shared shared
COPY --from=build /resources resources

WORKDIR /usr/src/app/server

# Replace with production dependencies
# RUN npm ci --production

# RUN useradd -ms /bin/bash -r -G audio,video sticker
RUN adduser --shell /bin/bash --disabled-password sticker sticker && \
  adduser sticker netdev && \
  adduser sticker video && \
  adduser sticker audio

RUN chown -R sticker:sticker ..

USER sticker

CMD npm run start:prod

EXPOSE 5000