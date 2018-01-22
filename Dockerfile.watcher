FROM node:slim
ENV NODE_ENV dev
RUN mkdir -p /var/app
COPY . /var/app
RUN apt-get update && apt-get install -y git
RUN cd /var/app/watcher && npm update && \
        npm install --silent 
RUN cd /var/app/webapp && npm update && \
        npm install --silent 
WORKDIR /var/app/watcher
ENV NODE_ENV=production
CMD ["node", "server.js"]
