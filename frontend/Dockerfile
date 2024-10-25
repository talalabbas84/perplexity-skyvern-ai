# Use an official Node.js image as the base image
FROM node:16

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json into the container
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the entire frontend application into the container
COPY . .

# Expose the port that the app will run on
EXPOSE 3000

# Start the development server for hot-reloading
CMD ["npm", "start"]
