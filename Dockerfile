FROM node:20-alpine

WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy source code
COPY . .

# Create uploads directory
RUN mkdir -p public/uploads

# Build the application
RUN npm run build

EXPOSE 3000

# Start script that seeds the database and starts the app
CMD ["sh", "-c", "npm run db:push && npm run db:seed && npm start"]
