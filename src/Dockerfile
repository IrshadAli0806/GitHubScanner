# Use an official Node.js runtime as the base image
FROM node:22

# Set the working directory in the container
WORKDIR /githubscanner/src

# Copy package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the port the app runs on
EXPOSE 3000

# Command to run the app
CMD ["node", "app.js"]
