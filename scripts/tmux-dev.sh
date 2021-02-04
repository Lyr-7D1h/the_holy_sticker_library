#!/bin/bash
# 
# AUTO RUN YOUR PROJECTS WITH ALL PANELS NEEDED
#

set -e

NAME="hsl"

CURRENT_DIR=$(realpath `dirname "$0"`)
PROJECT_FOLDER=`dirname $CURRENT_DIR`

if ! command -v tmux &> /dev/null
then
	echo Please install tmux
	echo More info at https://github.com/tmux/tmux 
	exit 1
fi


has_session() {
  tmux has-session -t $NAME 2>/dev/null
}

if has_session
then
	echo "Session: '$NAME' already exists"
	tmux a -t $NAME
	exit 1
fi

cd $PROJECT_FOLDER

tmux new-session -d -s $NAME
tmux send-keys -t $NAME "cd client" C-m
tmux send-keys -t $NAME "npm start" C-m
tmux split-window -h 
tmux send-keys -t $NAME "cd server" C-m
tmux send-keys -t $NAME "npm start" C-m
tmux split-window -v -t $NAME:0.0 -p 30 
tmux send-keys -t $NAME "npm run watch:shared" C-m
tmux a -d -t $NAME
