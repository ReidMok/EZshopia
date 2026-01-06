# Ezshopia - AI Commerce Dashboard

## 🚀 Project Overview
Ezshopia is a self-hosted, AI-native e-commerce platform designed to bridge the gap between simple SaaS (like Shopify) and total data ownership (like WordPress).

## ⚠️ Critical Deployment Note
**Important:** If you are using the free tier of GitHub, you **must set this repository to PUBLIC**.
GitHub Pages (the hosting service configured in `.github/workflows`) does not work with Private repositories on free accounts.

1. Go to **Settings** tab in GitHub.
2. Scroll to **Danger Zone**.
3. Click **Change repository visibility** -> Select **Public**.

## 🛠️ Tech Stack
- **Framework**: Next.js 14 (React)
- **Styling**: Tailwind CSS
- **Deployment**: Static Export (`output: 'export'`) for Hostinger/GitHub Pages
- **AI Core**: Google Gemini API (Model: 2.5 Flash & 3.0 Pro)

## 🔑 Configuration
This project is configured to auto-deploy to Hostinger.
- **API Keys**: The `API_KEY` is loaded from Hostinger's environment variables via `next.config.mjs`.
- **Output**: The build output is located in the `out/` directory.

## 📦 Deployment Checklist
- [x] Repository visibility set to **Public**
- [x] API Key added to Environment Variables
- [x] Build command set to `npm run build`
- [x] Output directory set to `out`

## 🔄 Version History
- **v0.1.6**: Updated documentation regarding Public repo requirement. Fixed local preview conflict.
