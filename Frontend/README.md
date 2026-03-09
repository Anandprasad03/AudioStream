# Frontend

This frontend is built for the existing backend routes in `Backend/src`.

## Setup

1. Start backend first (default: `http://localhost:3000`).
2. Run frontend:

```bash
npm install
npm run dev
```

Frontend runs on `http://localhost:5173` and proxies `/api/*` to backend.

## Mapped Backend APIs

- `POST /api/auth/register`
- `POST /api/auth/login`
- `POST /api/auth/logout`
- `POST /api/music/upload` (artist only)
- `POST /api/music/album` (artist only)
- `GET /api/music` (user only)
- `GET /api/music/albums` (user only)
- `GET /api/music/albums/:id` (user only)

## Notes

- Auth token is cookie-based and requests use `credentials: include`.
- User session is stored in local storage as `spotify_user` for route handling.
- Because backend currently restricts `GET /api/music` to `user` role, artist album creation uses IDs from freshly uploaded tracks in the current session.
