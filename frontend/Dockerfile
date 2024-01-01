# Use the official Node.js image
FROM node:alpine

# Set the working directory in the container
WORKDIR /app/frontend

# Copy package.json and package-lock.json to install dependencies
COPY ./package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application code
COPY . .
