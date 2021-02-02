#!/bin/bash

CURRENT_DIR=$(realpath `dirname "$0"`)
PROJECT_FOLDER=`dirname $CURRENT_DIR`

npm ci

cd $PROJECT_FOLDER/server
npm ci 

cd $PROJECT_FOLDER/client
npm ci