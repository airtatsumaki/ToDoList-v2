FROM node:16-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
# where available (npm@5+)
COPY package*.json ./

RUN npm install
# If you are building your code for production
# RUN npm ci --only=production

# Bundle app source
COPY . .

EXPOSE 8080
CMD [ "node", "index.js" ]

# docker build . (build the image)
# docker images (see the image that was created)
# docker run -d -p 3000:3000 <IMAGE_ID> (run the image in a container)
# docker ps (see running containers)
# docker stop <CONTAINER_ID> (stop the running container)
# docker rm <CONTAINER_ID> (delete the container)
# docker rmi <IMAGE_ID> (delete the image)