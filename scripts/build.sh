#!/usr/bin/env bash
# Build all projects needed for production

set -e

# Skip chromium download, already using system chromium
export PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true

CURRENT_DIR=$(realpath `dirname "$0"`)
PROJECT_FOLDER=`dirname $CURRENT_DIR`

npm ci

build_shared() {
  cd $PROJECT_FOLDER/shared
  rm -rf $PROJECT_FOLDER/shared/build
  npx tsc 
}

build_server() {
  cd $PROJECT_FOLDER/server
  npm ci 
  npm run build 
}

build_client() {
  cd $PROJECT_FOLDER/client
  npm ci
  npm run build 
  rm -rf $PROJECT_FOLDER/server/public
  mv build $PROJECT_FOLDER/server/public
}

build_shared &
build_server &
build_client &

wait