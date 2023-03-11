#!/bin/sh

while [ -z "${TOKEN}" ]; do 
  echo "Waiting for logs..."
  sleep 1
  export TOKEN=$(grep -m1 -h -oP 'token=\K\S+' /teamspeak/logs/*)
done & /teamspeak/init & tail -f /dev/null