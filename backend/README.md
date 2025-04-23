# Build Ethiopia Backend

This is the backend API for the Build Ethiopia project built with Node.js and Express.

## Setup

1. Install dependencies:

```bash
npm install
```

2. Create a `.env` file in the root directory with the following variables:

```
PORT=5000
SUPABASE_URL=your_supabase_url
SUPABASE_ANON_KEY=your_supabase_anon_key
NODE_ENV=development
```

3. Start the development server:

```bash
npm run dev
```

The server will start on http://localhost:5000

## API Routes

- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/auth/logout` - User logout
- `GET /api/users` - Get all users
- `GET /api/users/:id` - Get user by ID
- `PUT /api/users/:id` - Update user
- `DELETE /api/users/:id` - Delete user

More routes will be implemented for projects, profiles, and admin functionality.

## Detailed API Documentation

### Authentication

#### POST /api/auth/login

- **Description:** User login
- **Request Body:**
  - `email` (string, required)
  - `password` (string, required)
- **Response:**
  - 200: Login successful (to be implemented)
  - 401: Invalid credentials (to be implemented)

#### POST /api/auth/register

- **Description:** User registration
- **Request Body:**
  - `name` (string, required)
  - `email` (string, required)
  - `password` (string, required)
- **Response:**
  - 201: Registration successful (to be implemented)
  - 400: Registration failed (to be implemented)

#### POST /api/auth/logout

- **Description:** User logout
- **Response:**
  - 200: Logout successful (to be implemented)

---

### Users

#### GET /api/users

- **Description:** Get all users
- **Response:**
  - 200: List of users (to be implemented)

#### GET /api/users/:id

- **Description:** Get user by ID
- **Params:**
  - `id` (string, required)
- **Response:**
  - 200: User object (to be implemented)
  - 404: User not found (to be implemented)

#### PUT /api/users/:id

- **Description:** Update user
- **Params:**
  - `id` (string, required)
- **Request Body:**
  - User fields to update (to be implemented)
- **Response:**
  - 200: User updated (to be implemented)
  - 400: Update failed (to be implemented)

#### DELETE /api/users/:id

- **Description:** Delete user
- **Params:**
  - `id` (string, required)
- **Response:**
  - 200: User deleted (to be implemented)
  - 404: User not found (to be implemented)

---

## Projects

#### POST /api/projects

- **Description:** Create a new project
- **Request Body:**
  - `title` (string, required)
  - `description` (string, required)
  - `category` (string, required)
  - `post_content` (string, required)
  - `tech_stack` (array of strings, optional)
  - `youtube_video_url` (string, optional)
  - `images` (array of strings, optional)
  - `logo_url` (string, optional)
  - `developer_id` (string, required)
  - `github_url` (string, optional)
  - `live_url` (string, optional)
- **Response:**
  - 201: Project created successfully
  - 400: Validation error
  - 500: Server error

#### GET /api/projects

- **Description:** Get all projects
- **Response:**
  - 200: List of projects

#### GET /api/projects/:id

- **Description:** Get project by ID
- **Params:**
  - `id` (string, required)
- **Response:**
  - 200: Project object
  - 404: Project not found

#### PUT /api/projects/:id

- **Description:** Update a project
- **Params:**
  - `id` (string, required)
- **Request Body:**
  - Fields to update (same as POST)
- **Response:**
  - 200: Project updated
  - 400: Update failed

#### DELETE /api/projects/:id

- **Description:** Delete a project
- **Params:**
  - `id` (string, required)
- **Response:**
  - 200: Project deleted
  - 404: Project not found

---

## Profile

#### POST /api/profile/public

- **Description:** Update the public profile of the authenticated user
- **Request Body:**
  - `username` (string, required)
  - `name` (string, required)
  - `bio` (string, optional)
  - `location` (string, optional)
  - `website_url` (string, optional)
- **Response:**
  - 200: Profile updated successfully
  - 400: Validation error
  - 404: Profile not found
  - 500: Server error

---

## Admin

#### GET /api/admin

- **Description:** Get all projects (admin view)
- **Response:**
  - 200: List of projects
  - 500: Server error

#### PATCH /api/admin

- **Description:** Update a project's featured status
- **Request Body:**
  - `projectId` (string, required)
  - `featured` (boolean, required)
- **Response:**
  - 200: Featured status updated
  - 400: Invalid request
  - 500: Server error

#### GET /api/admin/history

- **Description:** Get featured projects history
- **Query Params:**
  - `projectId` (string, optional)
  - `page` (number, optional)
  - `limit` (number, optional)
- **Response:**
  - 200: List of featured project history
  - 500: Server error

---

> **Note:** Endpoints for `/api/projects`, `/api/profile`, and `/api/admin` are planned but not yet implemented.
