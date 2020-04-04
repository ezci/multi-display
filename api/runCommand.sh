#!/bin/bash

logFile=/var/log/vnc.log

if [[ -z "$1" ]] || [[ -z "$2" ]]; then
    echo -e "please display id and command" >> $logFile
    exit 1
fi


echo -e "display: $1 command:$2" >> $logFile

export DISPLAY=$1 && eval $2
echo -e "called command"  >> $logFile
exit 0