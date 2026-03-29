# Temenos

*A sacred tracker — fasting, body, sky, oracle, and the living calendar.*

## Deploy to GitHub Pages

### First time setup

1. Create a new GitHub repository called `temenos` (or any name you prefer)

2. Clone it locally:
   ```bash
   git clone https://github.com/YOUR_USERNAME/temenos.git
   cd temenos
   ```

3. Copy all files from this folder into the repo:
   ```
   temenos/
   ├── public/
   │   ├── index.html
   │   ├── manifest.json
   │   ├── sw.js
   │   ├── icon-192.png   ← you'll add this
   │   └── icon-512.png   ← you'll add this
   └── .github/
       └── workflows/
           └── deploy.yml
   ```

4. Enable GitHub Pages:
   - Go to your repo → Settings → Pages
   - Under "Source", select **GitHub Actions**

5. Push to main:
   ```bash
   git add .
   git commit -m "Launch Temenos"
   git push origin main
   ```

6. GitHub Actions will deploy automatically. Your app will be live at:
   `https://YOUR_USERNAME.github.io/temenos/`

### Adding the app icon

You'll need two PNG icons:
- `public/icon-192.png` — 192×192px
- `public/icon-512.png` — 512×512px

A simple dark indigo circle with a gold ⊕ symbol works beautifully and matches the aesthetic.
You can create these in Canva, Figma, or any image editor.

### Installing to your Android home screen

1. Open Chrome on your Samsung Galaxy S23
2. Navigate to your GitHub Pages URL
3. Tap the three-dot menu → "Add to Home screen"
4. Tap "Install"

Temenos will now appear as a standalone app. When you first open it,
allow notifications when prompted — this enables fasting window reminders.

### Updating the app

Any push to `main` automatically redeploys via GitHub Actions.
Edit `public/index.html` locally, commit, push — done.

---

*Built with React, Cormorant Garamond, and the living calendar.*
