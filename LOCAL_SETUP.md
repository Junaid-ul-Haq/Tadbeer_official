# Local Development Setup Guide

## Quick Start for Local Testing

### 1. Frontend Setup (Next.js)

The frontend is now configured to use `http://localhost:4000` by default.

**Option 1: Use default (Recommended)**
- No `.env.local` file needed - it will use `http://localhost:4000` automatically

**Option 2: Create `.env.local` file (Optional)**
```bash
# In Tadbeer-1- folder
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

### 2. Backend Setup (Express)

Make sure your backend `.env` file has:
```env
MONGO_URI=your_existing_mongodb_uri (keep this as is - it's working)
PORT=4000
NODE_ENV=development
CORS_ORIGIN=http://localhost:3000
JWT_SECRET=your_jwt_secret
```

### 3. Start Both Servers

**Terminal 1 - Backend:**
```bash
cd Tabdeer_backend-1-
npm install
npm start
# Should run on http://localhost:4000
```

**Terminal 2 - Frontend:**
```bash
cd Tadbeer-1-
npm install
npm run dev
# Should run on http://localhost:3000
```

### 4. Test the Connection

- Frontend: http://localhost:3000
- Backend API: http://localhost:4000

All API calls will automatically use `http://localhost:4000` for local development.

---

## When Ready for Production

To switch back to production domain:

1. Update `.env.local` (or create it):
```env
NEXT_PUBLIC_API_BASE_URL=https://tadbeerresource.com:4000
```

OR if behind reverse proxy:
```env
NEXT_PUBLIC_API_BASE_URL=https://tadbeerresource.com
```

2. Restart the Next.js dev server

---

## Notes

- ✅ MONGO_URI remains unchanged (as requested)
- ✅ All API calls have fallback to localhost:4000
- ✅ CORS is already configured for localhost:3000
- ✅ No breaking changes - works with or without .env.local

