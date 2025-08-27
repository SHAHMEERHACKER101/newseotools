# NexusRank Pro - Advanced AI-Powered SEO Toolkit

Professional AI-powered SEO and writing tools for content creators, marketers, and businesses. Generate high-ranking content, humanize AI text, check grammar, and dominate search results with advanced artificial intelligence technology.

## Features

- **Advanced AI SEO Writer**: Generate comprehensive, SEO-optimized articles up to 10,000 words
- **AI Text Humanizer**: Transform AI-generated text to sound 100% human-written
- **Advanced AI Detector**: Detect AI-generated content with professional-grade accuracy
- **Professional Paraphrasing Tool**: Rewrite content while preserving meaning
- **Advanced Grammar Checker**: Fix grammar, spelling, and punctuation errors instantly
- **Professional Text Improver**: Enhance clarity, fluency, and professionalism

## Deployment

### Frontend (Cloudflare Pages)
1. Push this repository to GitHub
2. Connect to Cloudflare Pages
3. Deploy from main branch
4. Set build command to: `echo "Static site ready"`
5. Set build output directory to: `/` (root)

### Backend (Cloudflare Workers)
1. Navigate to `backend/` directory
2. Install Wrangler CLI: `npm install -g wrangler`
3. Login to Cloudflare: `wrangler auth login`
4. Set your Google Gemini API key: `wrangler secret put GEMINI_API_KEY`
5. Deploy worker: `wrangler deploy`

## Configuration

Make sure to set the `GEMINI_API_KEY` environment variable in your Cloudflare Worker settings.

## Technology Stack

- **Frontend**: HTML, CSS, JavaScript (Vanilla)
- **Backend**: Cloudflare Workers
- **AI**: Google Gemini API
- **Hosting**: Cloudflare Pages + Workers
- **CDN**: Global Cloudflare Network

## License

MIT License - see LICENSE file for details.

## Support

For support and inquiries, visit our contact page or reach out through our support channels.

---

© 2025 NexusRank Pro. All rights reserved. Powered by Advanced AI Technology.