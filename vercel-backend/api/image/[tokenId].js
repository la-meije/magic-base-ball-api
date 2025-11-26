// api/image/[tokenId].js
// Generates the NFT card image dynamically

import { ethers } from 'ethers';

const CONTRACT_ABI = [
  "function prophecies(uint256) view returns (string question, string answer, uint256 timestamp)"
];

export default async function handler(req, res) {
  const { tokenId } = req.query;

  if (!tokenId || isNaN(tokenId)) {
    return res.status(400).send('Invalid token ID');
  }

  try {
    // Fetch data from blockchain
    const provider = new ethers.JsonRpcProvider(
      process.env.BASE_RPC_URL || 'https://mainnet.base.org'
    );

    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      CONTRACT_ABI,
      provider
    );

    const [question, answer] = await contract.prophecies(tokenId);

    // Generate SVG (we'll use SVG for Vercel since Canvas needs native dependencies)
    const svg = generateCardSVG(question, answer, tokenId);

    // Set headers
    res.setHeader('Content-Type', 'image/svg+xml');
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    
    return res.status(200).send(svg);

  } catch (error) {
    console.error('Image generation error:', error);
    
    // Return a placeholder error image
    const errorSvg = generateErrorSVG(tokenId);
    res.setHeader('Content-Type', 'image/svg+xml');
    return res.status(200).send(errorSvg);
  }
}

function generateCardSVG(question, answer, tokenId) {
  // Truncate long text
  const truncateText = (text, maxLength) => {
    if (text.length <= maxLength) return text;
    return text.substring(0, maxLength - 3) + '...';
  };

  const displayQuestion = truncateText(question, 120);
  const displayAnswer = truncateText(answer, 80);

  return `
    <svg width="800" height="1200" viewBox="0 0 800 1200" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <!-- Blueprint Pattern -->
        <pattern id="grid" width="30" height="30" patternUnits="userSpaceOnUse">
          <path d="M 30 0 L 0 0 0 30" fill="none" stroke="#e5e7eb" stroke-width="1"/>
        </pattern>
        
        <!-- Gradients -->
        <linearGradient id="headerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" style="stop-color:#3b82f6;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#2563eb;stop-opacity:1" />
        </linearGradient>
        
        <radialGradient id="ballGrad" cx="35%" cy="35%">
          <stop offset="0%" style="stop-color:#ffffff;stop-opacity:1" />
          <stop offset="40%" style="stop-color:#e5e7eb;stop-opacity:1" />
          <stop offset="100%" style="stop-color:#d1d5db;stop-opacity:1" />
        </radialGradient>

        <!-- Font imports -->
        <style>
          @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&amp;display=swap');
          
          .retro { 
            font-family: 'Press Start 2P', monospace; 
          }
          .question-text {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
            font-size: 28px;
            font-weight: 500;
            font-style: italic;
          }
          .answer-text {
            font-family: 'Press Start 2P', monospace;
            font-size: 36px;
            font-weight: bold;
            letter-spacing: 2px;
          }
        </style>
      </defs>

      <!-- Background -->
      <rect width="800" height="1200" fill="#f0f2f5"/>
      <rect width="800" height="1200" fill="url(#grid)"/>

      <!-- Main Card -->
      <rect x="40" y="40" width="720" height="1120" rx="24" fill="white" stroke="#1e293b" stroke-width="8"/>

      <!-- Header -->
      <rect x="60" y="60" width="680" height="120" rx="16" fill="url(#headerGrad)"/>
      <text x="400" y="115" text-anchor="middle" class="retro" font-size="32" fill="white">
        MAGIC BASE BALL
      </text>
      <text x="680" y="130" text-anchor="end" font-size="48">⚾</text>
      <text x="120" y="130" font-size="48">⚾</text>

      <!-- Baseball -->
      <circle cx="400" cy="300" r="100" fill="url(#ballGrad)" stroke="#e5e7eb" stroke-width="4"/>
      
      <!-- Stitching (curved paths) -->
      <path d="M 320 300 Q 400 270 480 300" 
            stroke="#dc2626" stroke-width="6" fill="none" stroke-linecap="round"/>
      <path d="M 320 300 Q 400 330 480 300" 
            stroke="#dc2626" stroke-width="6" fill="none" stroke-linecap="round"/>
      
      <!-- Stitch marks left -->
      <g stroke="#dc2626" stroke-width="5" stroke-linecap="round">
        <line x1="325" y1="295" x2="335" y2="305"/>
        <line x1="340" y1="285" x2="350" y2="295"/>
        <line x1="355" y1="278" x2="365" y2="288"/>
        <line x1="370" y1="273" x2="380" y2="283"/>
      </g>
      
      <!-- Stitch marks right -->
      <g stroke="#dc2626" stroke-width="5" stroke-linecap="round">
        <line x1="475" y1="295" x2="465" y2="305"/>
        <line x1="460" y1="285" x2="450" y2="295"/>
        <line x1="445" y1="278" x2="435" y2="288"/>
        <line x1="430" y1="273" x2="420" y2="283"/>
      </g>

      <!-- Question Box -->
      <rect x="80" y="440" width="640" height="240" rx="16" fill="#ffffff" stroke="#cbd5e1" stroke-width="4"/>
      <rect x="80" y="440" width="640" height="240" rx="16" fill="url(#grid)" opacity="0.3"/>
      
      <text x="100" y="475" font-family="Arial" font-size="20" font-weight="bold" fill="#64748b" letter-spacing="2">
        YOU ASKED
      </text>
      
      <foreignObject x="100" y="500" width="600" height="160">
        <div xmlns="http://www.w3.org/1999/xhtml" style="
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif;
          font-size: 28px;
          font-weight: 500;
          font-style: italic;
          color: #475569;
          line-height: 1.4;
          padding: 10px;
          word-wrap: break-word;
        ">
          "${displayQuestion}"
        </div>
      </foreignObject>

      <!-- Divider -->
      <line x1="200" y1="720" x2="340" y2="720" stroke="#cbd5e1" stroke-width="3"/>
      <circle cx="400" cy="720" r="8" fill="#cbd5e1"/>
      <line x1="460" y1="720" x2="600" y2="720" stroke="#cbd5e1" stroke-width="3"/>

      <!-- Answer Box -->
      <rect x="80" y="760" width="640" height="240" rx="16" fill="#eff6ff" stroke="#3b82f6" stroke-width="4"/>
      
      <text x="100" y="795" font-family="Arial" font-size="20" font-weight="bold" fill="#3b82f6" letter-spacing="2">
        THE ORACLE SAYS
      </text>
      
      <foreignObject x="100" y="820" width="600" height="160">
        <div xmlns="http://www.w3.org/1999/xhtml" style="
          font-family: 'Press Start 2P', monospace;
          font-size: 36px;
          font-weight: bold;
          color: #1e40af;
          line-height: 1.6;
          padding: 10px;
          text-align: center;
          display: flex;
          align-items: center;
          justify-content: center;
          height: 100%;
          letter-spacing: 1px;
        ">
          "${displayAnswer}"
        </div>
      </foreignObject>

      <!-- Footer -->
      <rect x="60" y="1040" width="680" height="100" rx="16" fill="#f8fafc" stroke="#cbd5e1" stroke-width="3"/>
      
      <text x="100" y="1075" font-family="monospace" font-size="18" fill="#64748b" font-weight="bold">
        ONCHAIN
      </text>
      <text x="100" y="1100" font-family="monospace" font-size="18" fill="#64748b" font-weight="bold">
        ORACLE
      </text>
      
      <text x="700" y="1070" text-anchor="end" font-family="monospace" font-size="16" fill="#64748b">
        MINT NO.
      </text>
      <text x="700" y="1105" text-anchor="end" class="retro" font-size="32" fill="#3b82f6">
        #${tokenId}
      </text>
      
      <!-- Base Logo -->
      <text x="400" y="1090" text-anchor="middle" font-size="24">🔵</text>
    </svg>
  `;
}

function generateErrorSVG(tokenId) {
  return `
    <svg width="800" height="1200" viewBox="0 0 800 1200" xmlns="http://www.w3.org/2000/svg">
      <rect width="800" height="1200" fill="#fee"/>
      <text x="400" y="600" text-anchor="middle" font-family="Arial" font-size="32" fill="#c00">
        Error loading token #${tokenId}
      </text>
      <text x="400" y="650" text-anchor="middle" font-family="Arial" font-size="20" fill="#666">
        Token may not exist or contract error
      </text>
    </svg>
  `;
}
