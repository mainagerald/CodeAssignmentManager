FROM node:20-alpine3.19

# copy from host machine to container
COPY package.json package-lock.json ./
RUN npm install

# GET THE SRC
COPY . .

# build
RUN npm build


# docker build . 
# docker images -a
# docker build -t front-end .
# 