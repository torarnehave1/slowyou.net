#!/bin/bash

cd /var/www/html/slowyou.net
pm2 stop slow
git pull
pm2 start slow