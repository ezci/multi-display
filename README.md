# vnc-pack
dockerized vnc + novnc pack 

[![npm version](https://badge.fury.io/js/vnc-pack.svg)](https://badge.fury.io/js/vnc-pack)


## Description
created for testing web applications on multiple screens with VNC and noVNC. allows to launch applications on specified screen from a central point.

## Installation



 * clone this project
 * `docker-compose up`
 * open `localhost:3000` in the browser

*if you wish to use only the nodejs cli (without noVnc) check out the npm.js package. make sure it runs on a linux OS along with packages in the Dockerfile installed.

 ## Notes

 * logs are avaible @ localhost:9001
 * beware the ports exposed in docker-compose.yml which allows up to 10 screens. change 5900-5910 & 6080-6090 ranges to modify it.
 * if you need to embed the screen in a web app, remove noVNC package from the Dockerfile and 6080-6090 port range from docker-compose.yml. connect to 5900.. ports directly. 
 * chromium-browser is added for testing web applications