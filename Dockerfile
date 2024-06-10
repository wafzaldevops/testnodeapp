# Use the official Node.js 20 image
FROM node:20.12.0-alpine

# Create and change to the app directory
WORKDIR /usr/src/app

# Copy the package.json and package-lock.json files
COPY package*.json ./

# Install dependencies
RUN npm install --production && npm cache clean --force

# Copy the rest of the application files
COPY . .

# Set environment variables
ENV NODE_ENV=production
ENV PORT=80

# Expose the port the app runs on
EXPOSE 80

# Define the command to run the app
CMD ["npm", "start"]
