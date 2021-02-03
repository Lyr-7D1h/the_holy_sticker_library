#!/bin/bash
# Build all projects needed for production

CURRENT_DIR=$(realpath `dirname "$0"`)
PROJECT_FOLDER=`dirname $CURRENT_DIR`

npm ci

cd $PROJECT_FOLDER/server
npm ci 
npm run build

cd $PROJECT_FOLDER/client
npm ci
npm run build
rm -rf $PROJECT_FOLDER/server/public
mv build $PROJECT_FOLDER/server/public