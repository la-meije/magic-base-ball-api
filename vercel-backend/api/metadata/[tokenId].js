// api/metadata/[tokenId].js
// Vercel Serverless Function - Returns NFT metadata JSON

import { ethers } from 'ethers';

// Contract ABI - Only the functions we need
const CONTRACT_ABI = [
  "function prophecies(uint256) view returns (string question, string answer, uint256 timestamp)",
  "function ownerOf(uint256) view returns (address)"
];

export default async function handler(req, res) {
  const { tokenId } = req.query;

  // Validate token ID
  if (!tokenId || isNaN(tokenId)) {
    return res.status(400).json({ error: 'Invalid token ID' });
  }

  try {
    // Connect to Base RPC
    const provider = new ethers.JsonRpcProvider(
      process.env.BASE_RPC_URL || 'https://mainnet.base.org'
    );

    const contract = new ethers.Contract(
      process.env.CONTRACT_ADDRESS,
      CONTRACT_ABI,
      provider
    );

    // Fetch prophecy data from blockchain
    let prophecy;
    try {
      prophecy = await contract.prophecies(tokenId);
    } catch (error) {
      // Token doesn't exist yet
      return res.status(404).json({ error: 'Token not found' });
    }

    // Check if token exists (has an owner)
    try {
      await contract.ownerOf(tokenId);
    } catch (error) {
      return res.status(404).json({ error: 'Token not minted yet' });
    }

    const [question, answer, timestamp] = prophecy;

    // Build metadata JSON
    const metadata = {
      name: `Magic Base Ball #${tokenId}`,
      description: 'A prophecy revealed by the Magic Base Ball. An on-chain fortune telling NFT on Base.',
      image: `${process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : process.env.BASE_URL}/api/image/${tokenId}`,
      external_url: `https://magicbaseball.xyz/nft/${tokenId}`,
      attributes: [
        {
          trait_type: 'Question',
          value: question
        },
        {
          trait_type: 'Answer',
          value: answer
        },
        {
          trait_type: 'Mint Date',
          display_type: 'date',
          value: Number(timestamp)
        },
        {
          trait_type: 'Mint Number',
          value: tokenId
        }
      ]
    };

    // Set cache headers (1 hour cache since data is immutable)
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400');
    res.setHeader('Content-Type', 'application/json');
    
    return res.status(200).json(metadata);

  } catch (error) {
    console.error('Metadata error:', error);
    return res.status(500).json({ 
      error: 'Failed to fetch metadata',
      details: error.message 
    });
  }
}
