# Docker production build
# See more: https://github.com/puppeteer/puppeteer/blob/main/docs/troubleshooting.md#running-on-alpine


FROM node:14-alpine AS build

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

RUN rm -rf /server/node_modules
RUN rm -rf /server/src


# Minimized version without source code 
FROM build 

WORKDIR /usr/src/app

COPY --from=build /server server
COPY --from=build /shared shared
COPY --from=build /resources resources

WORKDIR /usr/src/app/server

# Replace with production dependencies
RUN npm ci --production

RUN adduser --shell /bin/bash --disabled-password sticker sticker && \
  adduser sticker video && \
  adduser sticker audio

RUN chown -R sticker:sticker ../resources
# Hack to support undefined DB_PATH
RUN chown -R sticker:sticker .

USER sticker

CMD npm run start:prod

EXPOSE 5000