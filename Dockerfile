FROM node

WORKDIR /usr/src/
COPY . nuclear

RUN apt-get update && apt-get install -y libnss3 libgtk-3-0 libx11-xcb1 libxss1 libasound2

WORKDIR nuclear
RUN npm install && npm run build:dist && npm run build:electron && npm run pack
RUN ls -a | grep -v release | xargs rm -rf || true

CMD ["./release/linux-unpacked/nuclear"]
