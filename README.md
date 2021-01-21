# the_holy_sticker_library

A whatsapp bot for saving and sending stickers
Using **fastify** to show the qr code in a web interface
Using **venom-bot** for receiving messages.

# Requirements

Node.js V10+\
NPM V6+

# Commands

## Sync Stickers

When new stickers manually added add it to the db and hash all files in resources/stickers

```
npm run sync:stickers
```

## Run linter on all files

```
npm run lint
```

# Docker

```
docker build -t holystickerlibrary:latest .
docker run --privileged holystickerlibrary:latest
```
