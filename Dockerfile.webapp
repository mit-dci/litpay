FROM node:slim
ENV NODE_ENV dev
RUN mkdir -p /var/app
COPY . /var/app
RUN apt-get update && apt-get install -y git python build-essential
RUN npm install -g bower
RUN echo '{ "allow_root": true }' > /root/.bowerrc
RUN cd /var/app/watcher && npm update && \
        npm install --silent 
RUN cd /var/app/webapp && npm update && \
        npm install --silent && \
        bower install && \
        npm rebuild bcrypt --build-from-source
WORKDIR /var/app/webapp
ENV NODE_ENV=development
ENV DEBUG=express:*
CMD ["node", "server.js"]
