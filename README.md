# Restaurant AI Demo — Deployment Guide

## What's in this folder

```
restaurant-app/
├── server.js          ← Backend (handles API calls securely)
├── package.json       ← Node.js config
├── public/
│   └── index.html     ← Your full website
└── README.md          ← This file
```

---

## Deploy in 5 minutes — FREE on Render.com

### Step 1 — Get your Anthropic API Key
1. Go to https://console.anthropic.com/settings/keys
2. Click "Create Key"
3. Copy it — looks like: `sk-ant-api03-xxxxxxxxxxxx`

### Step 2 — Upload to GitHub
1. Go to https://github.com → Sign up free if needed
2. Click "New repository" → name it `restaurant-ai-demo`
3. Click "uploading an existing file"
4. Drag ALL files from this folder (server.js, package.json, and the public folder)
5. Click "Commit changes"

### Step 3 — Deploy on Render.com (free)
1. Go to https://render.com → Sign up with GitHub
2. Click "New +" → "Web Service"
3. Connect your `restaurant-ai-demo` repository
4. Fill in these settings:
   - **Name:** restaurant-ai-demo
   - **Runtime:** Node
   - **Build Command:** (leave empty)
   - **Start Command:** node server.js
5. Click "Advanced" → "Add Environment Variable"
   - Key: `ANTHROPIC_API_KEY`
   - Value: paste your `sk-ant-api03-...` key
6. Click "Create Web Service"
7. Wait 2 minutes → you get a live URL like:
   `https://restaurant-ai-demo.onrender.com`

---

## Personalise before going live

Open `public/index.html` and replace these placeholders:

| Find | Replace with |
|------|-------------|
| `YOUR NAME` | Your actual name |
| `YOUR@EMAIL.COM` | Your email |
| `YOUR_CALENDLY_LINK` | Your Calendly booking URL |
| `YOUR_PHONE_NUMBER` | Your WhatsApp number (e.g. 919876543210) |

---

## How it works (simple version)

```
Client browser → your Render server → Anthropic API → streams back to browser
```

Your API key lives ONLY on the server — clients never see it.

---

## Cost

- Render.com free tier: FREE (sleeps after 15 min inactivity, wakes in ~30 sec)
- Anthropic API: ~₹0.10–0.50 per generation (very cheap)
- Domain (optional): ~₹800/year from GoDaddy or Namecheap

---

## Upgrade options

| Need | Solution |
|------|----------|
| Always-on (no sleep) | Render paid plan ~$7/mo |
| Custom domain | Add in Render settings + buy domain |
| Usage limits | Add rate limiting to server.js |
| Analytics | Add Google Analytics to index.html |
