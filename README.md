# MERN Todo App

A full-stack todo app with user authentication, built with MongoDB, Express, React, and Node.js, all in TypeScript.

## Features

- Create, read, update, and delete todos
- Register, log in, and log out with JWT stored in an httpOnly cookie
- Passwords hashed with bcrypt
- Each user sees only their own todos
- Role-based access (`user` and `admin`)

## Tech Stack

| Layer    | Tools                                      |
| -------- | ------------------------------------------ |
| Frontend | React, Vite, TypeScript                    |
| Backend  | Node.js, Express, TypeScript, Mongoose     |
| Database | MongoDB (local or Atlas)                   |
| Auth     | jsonwebtoken, bcrypt, cookie-parser        |
| Other    | validator, morgan, cors, dotenv            |

## Project Structure

```
mern-todo/
├── client/              # React app (Vite)
│   └── src/
└── server/              # Express API
    ├── controllers/
    ├── middleware/
    ├── models/
    ├── routes/
    └── index.ts
```

## Getting Started

### Prerequisites

- Node.js 18 or later
- A MongoDB instance (local install or a free [Atlas](https://www.mongodb.com/atlas) cluster)

### Installation

```bash
git clone <your-repo-url>
cd mern-todo

# Backend
cd server
npm install

# Frontend
cd ../client
npm install
```

### Environment Variables

Create `server/.env`:

```
NODE_ENV=development
PORT=5000
DATABASE_LOCAL=mongodb://127.0.0.1:27017/todos
DATABASE=mongodb+srv://<user>:<PASSWORD>@<cluster>.mongodb.net/todos
DATABASE_PASSWORD=your_password
JWT_SECRET=your_long_random_string
```

Generate a secret with `openssl rand -hex 32`. Never commit `.env`.

### Run in Development

Use two terminals:

```bash
# Terminal 1: API on http://localhost:5000
cd server
npm run dev

# Terminal 2: React app on http://localhost:3000
cd client
npm run dev
```

The Vite dev server proxies `/api` requests to the backend, so the browser only talks to port 3000.

## API Reference

### Auth

| Method | Endpoint             | Access | Description              |
| ------ | -------------------- | ------ | ------------------------ |
| POST   | `/api/auth/register` | Public | Create an account        |
| POST   | `/api/auth/login`    | Public | Log in and set cookie    |
| POST   | `/api/auth/logout`   | Public | Clear the cookie         |
| GET    | `/api/auth/me`       | User   | Get the current user     |
| PATCH  | `/api/auth/password` | User   | Change password          |

### Todos

All todo routes require login and only return the current user's todos.

| Method | Endpoint         | Description        |
| ------ | ---------------- | ------------------ |
| GET    | `/api/todos`     | List your todos    |
| POST   | `/api/todos`     | Create a todo      |
| GET    | `/api/todos/:id` | Get one todo       |
| PATCH  | `/api/todos/:id` | Update a todo      |
| DELETE | `/api/todos/:id` | Delete a todo      |

### Users

| Method | Endpoint         | Access | Description                  |
| ------ | ---------------- | ------ | ---------------------------- |
| PATCH  | `/api/users/me`  | User   | Update your name or email    |
| DELETE | `/api/users/me`  | User   | Delete your account          |
| GET    | `/api/users`     | Admin  | List all users               |
| POST   | `/api/users`     | Admin  | Create a user                |
| GET    | `/api/users/:id` | Admin  | Get a user                   |
| DELETE | `/api/users/:id` | Admin  | Delete a user                |

### Response Format

```json
{ "status": "success", "data": { } }
```

Errors use `"status": "fail"` for client mistakes (4xx) and `"status": "error"` for server errors (5xx), with a `message` field.

## Creating the First Admin

Registration always creates a regular user. Register normally, then change `userType` to `admin` on that document in MongoDB Atlas or Compass.

## Security Notes

- Passwords are hashed and never returned in responses
- The JWT cookie is `httpOnly` and `sameSite: lax`, and `secure` in production
- Todos are filtered by owner on every query
- Request bodies are type-checked before reaching the database

## License

MIT