# URL Shortener

A lightweight URL shortening service with customizable short codes, expiration settings, and usage analytics.

## Features

- **Shorten URLs**: Convert long URLs into concise, shareable links.
- **Customizable Options**: Set custom short codes and expiration dates for shortened URLs.
- **Usage Analytics**: Track and view statistics for each shortened URL.

## Setup Instructions

1. **Environment Configuration**:

   - **Client**:
     - Navigate to the `client/urlshortner/` directory.
     - Create a `.env` file with the following:
       ```
       VITE_API_URL=your_backend_url
       ```
       Replace `your_backend_url` with the URL of your backend server (e.g., `http://localhost:5000`).
   - **Server**:
     - Navigate to the `server/` directory.
     - Create a `.env` file with the following:
       ```
       MONGO_URI=your_mongo_uri
       FRONTEND_URL=your_frontend_url
       PORT=your_desired_port
       ```
       Replace:
       - `your_mongo_uri` with your MongoDB connection string (e.g., `mongodb://localhost:27017/urlshortner`).
       - `your_frontend_url` with the URL of your frontend application (e.g., `http://localhost:5173`).
       - `your_desired_port` with the desired server port (e.g., `5000`).

2. **Install Dependencies**:

   - Navigate to `client/urlshortner/` and run:
     ```
     npm install
     ```
   - Navigate to `server/` and run:
     ```
     npm install
     ```

3. **Run the Application**:
   - **Client**: In the `client/urlshortner/` directory, start the development server:
     ```
     npm run dev
     ```
   - **Server**: In the `server/` directory, start the server with nodemon:
     ```
     node server.js
     ```

## API Endpoints

- **Create Short URL**:

  - **Endpoint**: `POST /api/v1/create`
  - **Description**: Creates a new shortened URL.
  - **Parameters**:
    - `url` (required): The original URL to shorten.
    - `customCode` (optional): A custom short code for the URL.
    - `expireAfter` (optional): Expiration time for the URL (in seconds).

- **View URL Stats**:

  - **Endpoint**: `GET /api/v1/stats/:shortCode`
  - **Description**: Retrieves usage statistics for a specific short code.

- **Redirect to Original URL**:
  - **Endpoint**: `GET /:shortCode`
  - **Description**: Redirects to the original URL associated with the short code.

## Notes

- Ensure MongoDB is running and accessible via the provided `MONGO_URI`.
- The frontend and backend URLs must be correctly configured in the `.env` files to avoid CORS issues.
- Use a tool like `nodemon` for automatic server restarts during development.
