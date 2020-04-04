#!/bin/bash

logFile=/var/log/vnc.log

if [[ -z "$1" ]] || [[ -z "$2" ]]; then
    echo -e "please display id, vnc and novnc ports" >> $logFile
    exit 1
fi


echo -e "display: $1 vnc:$2 novnc:$3" >> $logFile

export DISPLAY=$1 >> /root/.bashrc
x11vnc -display $1 -rfbport $2 -nopw -forever -shared -ncache 0 &
echo -e "called x11vnc"  >> $logFile
openbox-session &
echo -e "called openbox-session"  >> $logFile
./noVNC/utils/launch.sh --vnc localhost:$2 --listen $3 > $logFile
echo -e "called novnc - finished"  >> $logFile