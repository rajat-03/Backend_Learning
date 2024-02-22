# YouTube-like Video Managing Application Backend

This repository contains the backend code for a YouTube-like video managing application. The backend is implemented using Node.js with Express.js framework and MongoDB as the database.

## Features

- User registration and authentication
- User profile management
- Video management (upload, delete, update)
- Commenting on videos
- Liking videos
- Creating and managing playlists
- Subscription management
- Dashboard functionality

## Technologies Used

- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT for authentication
- Cloudinary for image/video hosting
- Other necessary npm packages

## Getting Started

To get started with this project, follow these steps:

1. Clone this repository to your local machine:

   ```bash
   git clone https://github.com/your-username/your-repository.git
   ```

2. Install dependencies:

    ```bash
    cd your-repository
    npm install
    ```
3. Set up environment variables:
 - Create a .env file in the root directory.
 - Define the following variables:

    ```bash
    PORT=8000
    MONGODB_URI=your-mongodb-uri
    ACCESS_TOKEN_SECRET=your-access-token-secret
    REFRESH_TOKEN_SECRET=your-refresh-token-secret
    ACCESS_TOKEN_EXPIRY=your-access-token-expiry
    REFRESH_TOKEN_EXPIRY=your-refresh-token-expiry
    CORS_ORIGIN=your-cors-origin
    ```

4. Start the server:

    ```bash
    npm run dev
    ```

## Postman
 - Postman is used for testing the API endpoints.
