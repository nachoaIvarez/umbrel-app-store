#!/bin/sh

privilege_key=$(cat /usr/share/nginx/html/privilege-key.txt) &&

export PRIVILEGE_KEY="$privilege_key" &&

envsubst < /usr/share/nginx/html/index.html > /usr/share/nginx/html/index.html && 

exec nginx -g 'daemon off;'