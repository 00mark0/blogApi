# Blog API Project

## Description

This project is a full-stack blog application that includes an admin panel for managing users, articles, and comments, as well as a frontend for displaying and interacting with blog content. The application is built with a modern tech stack and provides a comprehensive set of features for both administrators and regular users.

## Features

### Admin Panel (Admin Folder)

- **User Management**: Create, read, update, and delete (CRUD) operations for users.
- **Article Management**: CRUD operations for articles.
- **Comment Management**: CRUD operations for comments.

### Frontend (Frontend Folder)

- **Home Page**: Displays the most liked and most recent articles.
- **Articles Page**: Allows users to search articles by title, ID, or date created.
- **Article Page**: View articles, comment on articles, like articles, and like comments.
- **Profile Page**: Manage user information, change password, delete account, and manage user comments.

## .env Requirements (Backend Folder)

To run the server, you need to set up the following environment variables in a

.env

file in the backend folder:

```properties
DATABASE_URL=postgresql://<username>:<password>@localhost:5432/blog
PORT=3000
JWT_SECRET=<your-jwt-secret>
EMAIL=<your-email>
EMAIL_PASSWORD=<your-email-password>
```

Replace `<your-jwt-secret>`, `<your-email>`, and `<your-email-password>` with your actual credentials.

## Getting Started

0. **Fork and clone the repository**:

   ```sh
   git clone <repository-url>
   ```

1. **Initialize the database**

   Run the script from backend/scripts/initDb.js

   ```sh
   node initDb.js
   ```

2. **Navigate to the backend directory**:

   ```sh
   cd backend
   ```

3. **Install dependencies**:

   ```sh
   npm install
   ```

4. **Set up the .env file**:

Create a .env file in the backend directory and add the required environment variables as described above.

5.  **Run the server**:

    ```sh
    npm start
    ```

6.  **Navigate to the admin directory**:

    ```sh
    cd ../admin
    ```

7.  **Add a .env to the admin directory with this variable**

        VITE_TINYMCE_API_KEY=<your-tinymce-api-key>

Replace `<your-tinymce-api-key>` with your actual tinymce api key.

8. **Install dependencies**:

   ```sh
   npm install
   ```

9. **Run the admin panel**:

   ```sh
   npm run dev
   ```

10. **Navigate to the frontend directory**:

```sh
cd ../frontend
```

11. **Install dependencies**:

    ```sh
    npm install
    ```

12. **Run the frontend**:
    ```sh
    npm run dev
    ```

By following these steps, you will have the backend server, admin panel, and frontend running locally.
