require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const { mapLeetCode, mapGfg } = require('../src/services/dsaForgeImport');
const DSAQuestion = require('../models/DSAQuestion');

const DSA_REPO = process.env.DSA_REPO || 'shreyam91/Data_Structure_Algorithim';
const DSA_BRANCH = process.env.DSA_BRANCH || 'dsaforge';
const GITHUB_TOKEN = process.env.DSA_REPO_TOKEN;
const MONGODB_URI = process.env.MONGODB_URI;

async function syncDsaForge() {
  if (!MONGODB_URI) {
    console.error('Error: MONGODB_URI is required.');
    process.exit(1);
  }

  const GITHUB_API_URL = `https://api.github.com/repos/${DSA_REPO}/git/trees/${DSA_BRANCH}?recursive=1`;
  const RAW_BASE_URL = `https://raw.githubusercontent.com/${DSA_REPO}/${DSA_BRANCH}`;

  const headers = {
    'Accept': 'application/vnd.github.v3+json',
    'User-Agent': 'CodeStreak-Sync'
  };

  if (GITHUB_TOKEN) {
    headers['Authorization'] = `token ${GITHUB_TOKEN}`;
  }

  try {
    console.log(`Connecting to MongoDB...`);
    await mongoose.connect(MONGODB_URI);
    console.log(`Connected. Fetching tree from ${DSA_REPO}@${DSA_BRANCH}...`);

    // 1. Fetch the tree
    const treeResponse = await fetch(GITHUB_API_URL, { headers });
    if (!treeResponse.ok) {
      throw new Error(`GitHub API Error: ${treeResponse.status} ${treeResponse.statusText}`);
    }
    const treeData = await treeResponse.json();

    // 2. Discover problem folders containing metadata.json
    const metadataFiles = treeData.tree.filter(node => node.type === 'blob' && node.path.endsWith('/metadata.json'));
    const allBlobs = treeData.tree.filter(node => node.type === 'blob');

    let upsertedCount = 0;
    let modifiedCount = 0;

    // 3. Process each problem
    for (const metaNode of metadataFiles) {
      const folderPath = metaNode.path.replace(/\/metadata\.json$/, '');
      const folderName = folderPath.split('/').pop();

      try {
        // Fetch metadata.json
        const metaRes = await fetch(`${RAW_BASE_URL}/${metaNode.path}`, { headers });
        if (!metaRes.ok) {
          console.error(`Failed to fetch metadata for ${folderPath}: ${metaRes.statusText}`);
          continue;
        }
        const metadata = await metaRes.json();

        // Find solution file in the tree
        const solutionNode = allBlobs.find(node => 
          node.path.startsWith(`${folderPath}/solution.`) && 
          node.path !== `${folderPath}/metadata.json` && 
          node.path !== `${folderPath}/README.md`
        );

        let code = null;
        let solutionFileName = 'solution';
        if (solutionNode) {
          solutionFileName = solutionNode.path.split('/').pop();
          const codeRes = await fetch(`${RAW_BASE_URL}/${solutionNode.path}`, { headers });
          if (codeRes.ok) {
            code = await codeRes.text();
          } else {
            console.warn(`Failed to fetch solution code for ${folderPath}`);
          }
        }

        // Map to normalized schema
        const platform = metadata.source?.platform;
        const mapper = platform === 'gfg' ? mapGfg : mapLeetCode;
        const normalized = mapper(metadata);

        if (!normalized.slug) {
          console.warn(`Skipping ${folderPath}: no slug found in mapped metadata.`);
          continue;
        }

        normalized.submission = normalized.submission ?? {};
        if (!normalized.submission.code && code) {
          normalized.submission.code = code;
        }

        normalized.submission.githubPath =
          `https://github.com/${DSA_REPO}/blob/${DSA_BRANCH}/${folderPath}/${solutionFileName}`;

        normalized.folder = folderName;

        // Upsert into MongoDB
        const result = await DSAQuestion.updateOne(
          { platform: normalized.platform, pid: normalized.pid, slug: normalized.slug },
          { $set: normalized },
          { upsert: true }
        );

        if (result.upsertedCount > 0) upsertedCount++;
        if (result.modifiedCount > 0) modifiedCount++;

      } catch (err) {
        console.error(`Error processing ${folderPath}:`, err.message);
      }
    }

    console.log(`Sync completed: ${metadataFiles.length} scanned, ${upsertedCount} upserted, ${modifiedCount} modified.`);
    process.exit(0);

  } catch (error) {
    console.error('Sync failed:', error.message);
    process.exit(1);
  } finally {
    await mongoose.disconnect();
  }
}

syncDsaForge();
