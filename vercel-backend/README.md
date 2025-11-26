# Magic Base Ball API

Serverless metadata and image generation API for Magic Base Ball NFTs on Base.

## 🚀 Quick Deploy

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

## 📦 What This Does

This API provides two endpoints:

### 1. Metadata Endpoint
`/api/metadata/[tokenId]`

Returns standard NFT metadata JSON:
```json
{
  "name": "Magic Base Ball #1",
  "description": "A prophecy revealed by the Magic Base Ball",
  "image": "https://your-api.vercel.app/api/image/1",
  "attributes": [...]
}
```

### 2. Image Endpoint
`/api/image/[tokenId]`

Returns a dynamically generated SVG card image with:
- Retro-styled design
- Blueprint background
- Baseball illustration with stitching
- Question and answer from blockchain
- Mint number

## 🛠️ Setup

### 1. Clone Repository
```bash
git clone https://github.com/your-username/magic-base-ball-api
cd magic-base-ball-api
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Environment Variables

Create a `.env.local` file:
```bash
CONTRACT_ADDRESS=0xYourContractAddress
BASE_RPC_URL=https://mainnet.base.org
```

### 4. Run Locally
```bash
npm run dev
```

Visit: `http://localhost:3000/api/metadata/1`

### 5. Deploy to Vercel

```bash
npm run deploy
```

Or connect your GitHub repo to Vercel for auto-deploys!

## ⚙️ Environment Variables

Required variables in Vercel:

| Variable | Description | Example |
|----------|-------------|---------|
| `CONTRACT_ADDRESS` | Your deployed contract address | `0x742d35Cc...` |
| `BASE_RPC_URL` | Base RPC endpoint | `https://mainnet.base.org` |

## 📡 API Reference

### GET /api/metadata/[tokenId]

**Parameters:**
- `tokenId` (path) - Token ID to fetch

**Response:**
```json
{
  "name": "Magic Base Ball #1",
  "description": "A prophecy revealed by the Magic Base Ball. An on-chain fortune telling NFT on Base.",
  "image": "https://your-api.vercel.app/api/image/1",
  "external_url": "https://magicbaseball.xyz/nft/1",
  "attributes": [
    {
      "trait_type": "Question",
      "value": "Will I be rich?"
    },
    {
      "trait_type": "Answer",
      "value": "It is certain"
    },
    {
      "trait_type": "Mint Date",
      "display_type": "date",
      "value": 1701234567
    },
    {
      "trait_type": "Mint Number",
      "value": 1
    }
  ]
}
```

**Error Responses:**
- `400` - Invalid token ID
- `404` - Token not found/not minted
- `500` - Server error

### GET /api/image/[tokenId]

**Parameters:**
- `tokenId` (path) - Token ID to generate image for

**Response:**
- Returns SVG image (`image/svg+xml`)
- Dimensions: 800x1200px
- Includes question, answer, and mint number from blockchain

**Error Response:**
- Returns error SVG if token not found

## 🎨 Customization

### Modify Card Design

Edit `api/image/[tokenId].js` and update the `generateCardSVG()` function:

```javascript
function generateCardSVG(question, answer, tokenId) {
  // Customize SVG here
  return `<svg>...</svg>`;
}
```

Changes deploy automatically on Vercel!

### Add New Attributes

Edit `api/metadata/[tokenId].js`:

```javascript
attributes: [
  // ... existing attributes
  {
    trait_type: "Your New Trait",
    value: "Your Value"
  }
]
```

## 🔍 Monitoring

### View Logs
```
Vercel Dashboard → Your Project → Functions → Click function name
```

### Check Analytics
```
Vercel Dashboard → Your Project → Analytics
```

### Test Endpoints
```bash
# Test metadata
curl https://your-api.vercel.app/api/metadata/1

# Test image
curl https://your-api.vercel.app/api/image/1
```

## 🐛 Troubleshooting

### "Token not found"
- Token hasn't been minted yet
- Wrong CONTRACT_ADDRESS
- Wrong network (testnet vs mainnet)

**Fix:** Check environment variables in Vercel

### "Failed to fetch metadata"
- RPC endpoint down
- Contract address incorrect
- Network issues

**Fix:** Verify BASE_RPC_URL is working

### Images not updating
- Vercel caches responses for 1 hour
- OpenSea caches for longer

**Fix:** 
- Wait for cache to expire
- Force refresh metadata on OpenSea
- Update code to invalidate cache

## 📊 Performance

### Response Times
- Metadata: ~200-500ms
- Image: ~300-700ms (SVG generation)

### Caching
- Responses cached for 1 hour (`s-maxage=3600`)
- Stale-while-revalidate for 24 hours
- Reduces load on Vercel and blockchain RPC

### Rate Limits
- Vercel Free: Unlimited requests (fair use)
- 100GB bandwidth/month
- Plenty for most NFT projects

## 🔒 Security

### Rate Limiting
- Built into Vercel
- Auto-scaling handles traffic spikes

### Environment Variables
- Never commit .env to git
- Store securely in Vercel dashboard
- Rotate RPC URLs if exposed

### Input Validation
- Token IDs validated before querying
- Error handling for malformed requests
- Safe SVG generation (no XSS)

## 📝 Development

### Project Structure
```
magic-base-ball-api/
├── api/
│   ├── metadata/
│   │   └── [tokenId].js    # Metadata endpoint
│   └── image/
│       └── [tokenId].js     # Image endpoint
├── package.json
├── vercel.json              # Vercel config
└── .env.example             # Example env vars
```

### Local Development
```bash
# Install Vercel CLI
npm i -g vercel

# Run locally
vercel dev

# Deploy preview
vercel

# Deploy production
vercel --prod
```

## 🚀 Deployment

### Automatic (Recommended)
1. Push to GitHub
2. Connect repo to Vercel
3. Set environment variables
4. Auto-deploys on every push!

### Manual
```bash
vercel --prod
```

## 🔗 Links

- **Smart Contract:** [BaseScan](https://basescan.org)
- **Frontend:** [Your Website]
- **OpenSea:** [Collection Page]
- **Documentation:** [Full Docs](../VERCEL_DEPLOYMENT.md)

## 📜 License

MIT

## 🙏 Credits

Built with:
- [Vercel](https://vercel.com) - Serverless hosting
- [ethers.js](https://docs.ethers.org) - Ethereum library
- [Base](https://base.org) - L2 network

## 📞 Support

- Issues: [GitHub Issues]
- Docs: [Documentation](../VERCEL_DEPLOYMENT.md)
- Community: [Discord/Twitter]

---

**Built with ❤️ for Base 🔵**
