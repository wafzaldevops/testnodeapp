FROM library/node:20.12.0-alpine

RUN apk update && apk upgrade && apk add --no-cache git

RUN mkdir -p /usr/src/app
WORKDIR /usr/src/app

COPY ./package.json /usr/src/app/
RUN npm install --production && npm cache clean --force

COPY ./ /usr/src/app

# Copy the seeder script into the container
COPY seeder.js /usr/src/app/seeder.js

ENV NODE_ENV production
ENV PORT 80
EXPOSE 80

# Run the seeder script after starting the application
CMD ["sh", "-c", "node seeder.js && npm start"]
