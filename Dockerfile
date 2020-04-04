FROM ubuntu:18.04

ENV DEBIAN_FRONTEND=noninteractive \
    NOVNC_SHA="b403cb92fb8de82d04f305b4f14fa978003890d7" \
    WEBSOCKIFY_SHA="558a6439f14b0d85a31145541745e25c255d576b" \
    LOG_PATH=/var/log/supervisor

RUN apt-get -qqy update && apt-get -qqy --no-install-recommends install \
    curl \
    xvfb \
    x11vnc \
    openbox \
    wget \
    unzip \
    menu \
    net-tools \
    supervisor \
    chromium-browser
        
RUN curl -sL https://deb.nodesource.com/setup_12.x | bash - & \
    apt-get update && apt-get -y install nodejs npm


WORKDIR /app

RUN  wget -nv -O noVNC.zip "https://github.com/kanaka/noVNC/archive/${NOVNC_SHA}.zip" \
 && unzip -x noVNC.zip \
 && mv noVNC-${NOVNC_SHA} noVNC \
 && wget -nv -O websockify.zip "https://github.com/kanaka/websockify/archive/${WEBSOCKIFY_SHA}.zip" \
 && unzip -x websockify.zip \
 && mv websockify-${WEBSOCKIFY_SHA} ./noVNC/utils/websockify \
 && rm websockify.zip noVNC.zip \
 && ln noVNC/vnc_auto.html noVNC/index.html \
 && sed -i "s/<number>4<\/number>/<number>1<\/number>/g" /etc/xdg/openbox/rc.xml

#RUN npm install -g nodemon
COPY package.json .
RUN npm install
COPY . .
RUN chmod -R +x supervisord.conf api

CMD /usr/bin/supervisord --configuration supervisord.conf