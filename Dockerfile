# Node version
FROM node:16.6

# Working directory for source code
WORKDIR /usr/src/bot

# Copy package-lock and package json files
COPY package*.json ./

# Install deps from package
RUN npm install

# Copy all
COPY . .

# Start with node bot.js
CMD ["node", "bot.js"]
