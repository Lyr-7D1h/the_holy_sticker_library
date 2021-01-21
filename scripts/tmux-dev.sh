#!/bin/bash
# 
# AUTO RUN YOUR PROJECTS WITH ALL PANELS NEEDED
#

NAME="hsl"
PROJECT_FOLDER="$HOME/p/holy_sticker_library"

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

tmux new-session -d -s $NAME 'cd client && npm start' 
tmux split-window -h "cd server && npm start"
tmux split-window -v -t %0 -p 30 "cd server && npm run watch:shared"
tmux a -d -t $NAME
