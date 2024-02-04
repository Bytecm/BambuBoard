FROM node:18
ENV NODE_ENV=production

# Create app directory
WORKDIR /app

COPY ["package.json", "package-lock.json*", "./"]

RUN npm install --production

COPY example.config.json config.json

COPY . .

EXPOSE 8080
EXPOSE 3000
CMD [ "npm", "start" ]