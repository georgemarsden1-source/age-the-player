# GitHub Setup Guide for Age The Player

## Your GitHub Repository
**URL:** https://github.com/georgemarsden1-source/age-the-player

---

## Step 1: Push Code from Replit (One-time setup)

Open the **Shell** tab in Replit and run these commands:

```bash
# Add GitHub as a remote
git remote add github https://github.com/georgemarsden1-source/age-the-player.git

# Push your code to GitHub
git push github main
```

If asked for credentials, you may need to use a Personal Access Token from GitHub.

---

## Step 2: Clone the Repository on Your Mac

Open Terminal on your Mac and run:

```bash
# Navigate to your Desktop (or wherever you want the project)
cd ~/Desktop

# Clone the repository
git clone https://github.com/georgemarsden1-source/age-the-player.git

# Enter the project folder
cd age-the-player
```

---

## Daily Workflow

### When you make changes in Replit:

**In Replit Shell:**
```bash
git add .
git commit -m "Description of your changes"
git push github main
```

### To get changes on your Mac:

**In Mac Terminal:**
```bash
cd ~/Desktop/age-the-player
git pull origin main
```

---

## Building for iOS (On Your Mac)

After pulling the latest code:

```bash
# Install dependencies
npm install

# Build the web app
npm run build

# Sync to iOS
npx cap sync ios

# Open in Xcode
npx cap open ios
```

---

## Quick Reference

| Action | Command |
|--------|---------|
| Push changes from Replit | `git push github main` |
| Pull changes on Mac | `git pull origin main` |
| Build web app | `npm run build` |
| Sync to iOS | `npx cap sync ios` |
| Open Xcode | `npx cap open ios` |

---

## Troubleshooting

**"Permission denied" or authentication error:**
- Create a Personal Access Token at: https://github.com/settings/tokens
- Use the token as your password when pushing

**"Already up to date" but files are different:**
- Run `git fetch` then `git pull`

**Xcode build fails:**
- Make sure you ran `npm install` and `npm run build` first
- Run `npx cap sync ios` to update iOS files
