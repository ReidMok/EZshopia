# Troubleshooting Guide

## 1. "Something went wrong" when uploading to GitHub
This error usually happens when there is a **Merge Conflict** or an **Authentication Issue**.

### If the "Sync" or "Commit" button fails:
1. **Refresh the Browser**: Sometimes the cloud IDE disconnects from the git server. A full page refresh often fixes the "Something went wrong" error.
2. **Check Repository Permissions**: Ensure you are logged into the correct GitHub account.
3. **Repository Visibility**: If using GitHub Pages on a Free account, the repository **must be Public**.

### If you can access a Terminal eventually:
Run these commands to force your local changes to the server:
```bash
git add .
git commit -m "fix: resolve conflicts"
git push origin main
```

## 2. White Screen / Preview Not Loading
This is caused by the browser trying to load the old `index.html` file.
**Fix:** We have updated `index.html` to be a comment-only file. Please refresh the preview window.

## 3. Deployment 404 Error
- Go to your GitHub Repository Settings > Pages.
- Ensure "Source" is set to "Deploy from a branch" (usually `gh-pages` created by the Action).
- Ensure the repository is **Public**.
