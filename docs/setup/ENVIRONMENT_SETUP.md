# 🔧 Environment Variables Setup

## 📋 Required Environment Variables

### ✅ Supabase Configuration
```bash
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

### ✅ Sanity CMS Configuration
```bash
NEXT_PUBLIC_SANITY_PROJECT_ID=your_sanity_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2023-05-03
```

### ✅ App Configuration
```bash
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_APP_NAME=Dashboard Aziendale
```

## 🚀 Quick Setup

### 1. Copy Environment Template
```bash
cp env-setup.txt .env.local
```

### 2. Update Variables
Edit `.env.local` with your actual values:
- Replace `your_sanity_project_id` with your Sanity project ID
- Update Supabase URL and keys if needed

### 3. Restart Development Server
```bash
npm run dev
```

## 🔍 Troubleshooting

### ❌ Error: Missing environment variable: NEXT_PUBLIC_SANITY_DATASET
**Solution:** Ensure `.env.local` exists with all required variables

### ❌ Error: Supabase connection failed
**Solution:** Check `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`

### ❌ Error: Sanity client initialization failed
**Solution:** Verify `NEXT_PUBLIC_SANITY_PROJECT_ID` and `NEXT_PUBLIC_SANITY_DATASET`

## 📁 File Structure

```
├── .env.local          # Environment variables (not in git)
├── env-setup.txt       # Template with default values
├── env.example         # Example with all possible variables
└── docs/setup/
    └── ENVIRONMENT_SETUP.md  # This documentation
```

## 🔒 Security Notes

- `.env.local` is in `.gitignore` for security
- Never commit real API keys to git
- Use different keys for development/production
- Rotate keys regularly

## ✅ Verification

After setup, verify all variables are loaded:
1. Check browser console for errors
2. Verify Supabase connection works
3. Verify Sanity CMS loads correctly
4. Test all dashboard sections

---

**Environment setup complete!** 🚀✨
