#!/bin/sh

while [ ! -f "/teamspeak/privilege-key.txt" ]; do 
  echo "Waiting for logs..."
  sleep 1
  grep -m1 -h -oP 'token=\K\S+' /teamspeak/logs/* > /teamspeak/privilege-key.txt
done
