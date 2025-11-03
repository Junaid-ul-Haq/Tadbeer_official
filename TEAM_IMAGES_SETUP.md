# Team Images Setup Guide

## Problem Diagnosis
Images are not showing because:
1. ✅ **Code is updated** - Frontend is ready to load images from backend
2. ❌ **Images missing** - No images in `Tabdeer_backend-1-/uploads/team/` folder
3. ⚠️ **Environment variable** - Need to verify `NEXT_PUBLIC_API_BASE_URL` is set

## Step-by-Step Fix

### 1. Upload Images to Backend
Place your 8 team member images in:
```
Tabdeer_backend-1-/uploads/team/
```

**Required filenames:**
- `team-member-1.jpg`
- `team-member-2.jpg`
- `team-member-3.jpg`
- `team-member-4.jpg`
- `team-member-5.jpg`
- `team-member-6.jpg`
- `team-member-7.jpg`
- `team-member-8.jpg`

### 2. Check Environment Variable

Create or update `.env.local` in `Tadbeer-1-/` folder:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

**For production, use your actual backend URL:**
```env
NEXT_PUBLIC_API_BASE_URL=https://your-backend-domain.com:4000
```

### 3. Verify Backend is Running

Make sure your backend server is running and accessible.

Test the image URL directly in browser:
```
http://localhost:4000/files/team/team-member-1.jpg
```

If this works, the image should appear.

### 4. Update Team Member Names and Designations

Edit `Tadbeer-1-/app/components/landing/About.jsx` (lines 142-182):

Replace placeholder names and designations:
```javascript
const teamMembers = [
  {
    name: "Actual Name 1",
    designation: "Actual Designation 1",
    image: getTeamImageUrl("team-member-1.jpg"),
  },
  // ... update all 8 members
];
```

### 5. Debug

Open browser console (F12) and check for:
- ✅ "🔍 API Base URL:" - Shows your backend URL
- ✅ "🔍 Team images will be loaded from:" - Shows full image path
- ❌ "Failed to load image:" - Shows which images are failing

### 6. Test Image Access

Test if backend is serving files:
1. Open: `http://localhost:4000/files/team/team-member-1.jpg`
2. If image shows → Backend is working
3. If 404 → Image file doesn't exist or wrong path

## Image URL Format

Images are accessed via:
```
{NEXT_PUBLIC_API_BASE_URL}/files/team/{filename}
```

Example:
- Development: `http://localhost:4000/files/team/team-member-1.jpg`
- Production: `https://your-domain.com/files/team/team-member-1.jpg`

## Troubleshooting

### Images still not showing?
1. ✅ Check browser console for errors
2. ✅ Verify backend is running
3. ✅ Verify images exist in `uploads/team/` folder
4. ✅ Check file permissions (images should be readable)
5. ✅ Verify `NEXT_PUBLIC_API_BASE_URL` matches your backend URL
6. ✅ Clear browser cache (Ctrl+Shift+R)

### CORS Errors?
Check `Tabdeer_backend-1-/server.js` - CORS should allow your frontend origin.

### 404 Errors?
- Verify file names match exactly (case-sensitive)
- Verify images are in correct folder: `uploads/team/`
- Restart backend server after adding images

