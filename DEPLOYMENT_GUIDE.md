# Cloudflare Pages Deployment Guide
## Lighthouse CEO Search Chatbot

### 🚀 Deployment Options

#### Option A: GitHub Integration (Recommended)

1. **Visit Cloudflare Pages Dashboard**
   - Go to: https://dash.cloudflare.com/pages
   - Click "Create a project"

2. **Connect to Git Repository**
   - Choose "Connect to Git"
   - Select GitHub and authorize if needed
   - Select repository: `FJDallas2021/ExecAISearch`

3. **Configure Build Settings**
   ```
   Framework preset: None
   Build command: npm run build
   Build output directory: dist
   Root directory: (leave empty)
   Node.js version: 18 (or latest)
   ```

4. **Environment Variables** (if needed)
   - No special environment variables required for basic deployment
   - Add any API keys or secrets in the Pages dashboard if needed later

5. **Deploy**
   - Click "Save and Deploy"
   - Cloudflare will automatically build and deploy your site
   - You'll get a URL like: `https://lighthouse-ceo-chatbot.pages.dev`

#### Option B: CLI Deployment

1. **Authenticate with Cloudflare**
   ```bash
   npx wrangler login
   ```
   - This will open a browser window to authenticate

2. **Deploy the Project**
   ```bash
   npm run deploy
   ```
   - Or manually: `npm run build && wrangler pages deploy`

### 📋 Project Configuration

Your project is already configured with:
- ✅ `wrangler.jsonc` - Cloudflare configuration
- ✅ `package.json` - Build and deployment scripts
- ✅ `vite.config.ts` - Build configuration
- ✅ `dist/` directory - Build output folder

### 🔧 Build Commands

```bash
# Development
npm run dev

# Build for production
npm run build

# Preview locally
npm run preview

# Deploy to Cloudflare Pages
npm run deploy
```

### 🌐 Expected URLs After Deployment

- **Primary URL**: `https://lighthouse-ceo-chatbot.pages.dev`
- **Custom Domain**: You can add your own domain in Cloudflare Pages dashboard
- **Preview URLs**: Each commit will generate preview URLs for testing

### 🔄 Automatic Deployments

Once connected via GitHub:
- Every push to `main` branch triggers automatic deployment
- Pull requests generate preview deployments
- No manual deployment needed after initial setup

### 📊 Post-Deployment Steps

1. **Test the Deployed Chatbot**
   - Visit the main chatbot interface
   - Test the admin panel at `/admin`
   - Verify all Q&A responses work correctly

2. **Custom Domain Setup** (Optional)
   - Go to Cloudflare Pages dashboard
   - Navigate to your project → Custom domains
   - Add your domain (e.g., `ceo-search.execsearches.com`)
   - Update DNS settings as instructed

3. **Analytics & Monitoring**
   - Enable Cloudflare Web Analytics in the dashboard
   - Monitor usage and performance

### 🛠 Troubleshooting

**Build Fails?**
- Check Node.js version (use 18 or later)
- Verify `npm run build` works locally
- Check build logs in Cloudflare dashboard

**Site Not Working?**
- Verify `dist` folder contains built files
- Check browser console for JavaScript errors
- Ensure all dependencies are in `package.json`

**404 Errors on Routes?**
- Cloudflare Pages should handle SPA routing automatically
- Check if your app uses proper routing configuration

### 📞 Support

**F. Jay Hall**
- Email: fjhall@execsearches.com
- For deployment issues or custom domain setup

---

**Ready to Deploy!** Your chatbot is fully configured and ready for Cloudflare Pages deployment.