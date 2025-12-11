Server (login/register)

Quick setup:

1. Copy `.env.example` to `.env` and set `MONGO_URI`.
2. From `server/` run:

```powershell
npm install
node server.js
```

Endpoints:

- `POST /api/register` { username, password }
- `POST /api/login` { username, password }

Notes:

- Passwords are hashed with `bcryptjs`.
- This example returns a simple success response on login; add JWT or sessions for production.
