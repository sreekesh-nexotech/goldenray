FROM node:18

# Install system dependencies for sharp
RUN apt-get update && apt-get install -y \
    libvips-dev

WORKDIR /app
COPY package*.json ./

# Force sharp to compile for your CPU
RUN npm install --ignore-scripts=false sharp
RUN npm install

COPY . .
RUN npm run build

# Expose the port the app runs on
EXPOSE 3000

# Command to run the application
CMD ["npm", "run", "start"]
