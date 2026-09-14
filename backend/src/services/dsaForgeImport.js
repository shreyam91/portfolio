/**
 * dsaForgeImport — import surface for DSAForge metadata.
 *
 * DSAForge (a browser extension) pushes each solved LeetCode / GFG problem to a
 * GitHub repo as:
 *
 *   {folder}/
 *   ├── solution.{ext}      <- the submitted code
 *   ├── README.md
 *   └── metadata.json       <- factual problem + submission data (source of truth)
 *
 * This service reads every `backend/data/dsaForge/{folder}/metadata.json` plus
 * its `solution.*` file and maps the raw DSAForge shape into the normalized
 * DSAQuestion record stored in Mongo.
 *
 * Automation (pulling live from the GitHub repo) is deferred; this manual import
 * path is the structure automation will later drive. Drop a real DSAForge
 * metadata.json + solution into `backend/data/dsaForge/{slug}/` and re-seed.
 */
const fs = require('fs');
const path = require('path');

const DSA_FORGE_DIR = path.join(__dirname, '../../data/dsaForge');

/**
 * Set to your DSAForge output repo (the one the extension pushes to).
 * The "View on GitHub" link in the portfolio is built from this.
 */
const GITHUB_BASE =
  'https://github.com/shreyam91/Data_Structure_Algorithim';

const GITHUB_BRANCH = 'dsaforge';

/**
 * The folder each problem lives under in the DSAForge output repo.
 * For these fixtures the on-disk folder name is the problem slug, so a solution
 * lives at `{GITHUB_BASE}/blob/{GITHUB_BRANCH}/{slug}/solution.{ext}`.
 * If your real DSAForge repo uses a different layout (e.g. LeetCode's
 * `0001-two-sum` numbered folders), adjust this per platform below.
 */
function githubFolderName(slug) {
  return slug;
}

/** Read the first `solution.<ext>` filename in a folder, else null. */
function findSolutionFile(folderPath) {
  let entries;
  try {
    entries = fs.readdirSync(folderPath, { withFileTypes: true });
  } catch (err) {
    return null;
  }
  const solution = entries.find((e) => e.isFile() && /^solution\./.test(e.name));
  return solution ? solution.name : null;
}

function readJson(filePath) {
  return JSON.parse(fs.readFileSync(filePath, 'utf8'));
}

/**
 * Map a LeetCode DSAForge metadata object into the normalized record.
 * shape → see DSAForge/src/js/leetcode.js `buildLeetCodeMetadata`.
 */
function mapLeetCode(metadata) {
  const problem = metadata.problem ?? {};
  const submission = metadata.submission ?? {};
  const performance = metadata.performance ?? {};

  return {
    platform: 'leetcode',
    pid: String(problem.frontendId ?? problem.id ?? ''),
    slug: problem.slug,
    title: problem.title,
    problemUrl: metadata.source?.url,
    difficulty: problem.difficulty ?? undefined,
    description: problem.description ?? undefined,
    topics: Array.isArray(problem.topics) ? problem.topics : [],
    submission: {
      code: submission.code ?? undefined,
      language: submission.language ?? undefined,
      status: submission.status ?? undefined,
      runtime: performance.runtime ?? undefined,
      submittedAt: submission.submittedAt ?? undefined,
    },
  };
}

/**
 * Map a GeeksforGeeks DSAForge metadata object into the normalized record.
 * shape → see DSAForge/src/js/gfg.js `buildGfgMetadata`.
 */
function mapGfg(metadata) {
  const problem = metadata.problem ?? {};
  const submission = metadata.submission ?? {};
  const tagList = metadata.tagList ?? {};

  return {
    platform: 'gfg',
    pid: String(problem.pid ?? metadata.source?.id ?? ''),
    slug: problem.slug,
    title: problem.title,
    problemUrl: metadata.source?.url,
    difficulty: problem.difficulty ?? undefined,
    description: problem.statement ?? undefined,
    examples: Array.isArray(problem.examples) ? problem.examples : undefined,
    inputFormat: metadata.inputFormat ?? undefined,
    constraints: metadata.constraints ?? undefined,
    expectedTimeComplexity: metadata.complexity?.time ?? undefined,
    expectedAuxiliarySpace: metadata.complexity?.auxiliarySpace ?? undefined,
    topics: Array.isArray(tagList.topicTags) ? tagList.topicTags : [],
    companies: Array.isArray(tagList.companyTags) ? tagList.companyTags : undefined,
    submission: {
      code: submission.code ?? undefined,
      language: submission.language ?? undefined,
      submissionId: submission.submissionId ?? undefined,
      status: submission.status ?? undefined,
      viewMode: submission.viewMode ?? undefined,
      runtime: submission.runtime ?? undefined,
      submittedAt: submission.submittedAt ?? undefined,
    },
  };
}

/** Normalize one folder: read metadata.json, attach code + githubPath. */
function importProblemFolder(folderPath, folderName) {
  const metadataPath = path.join(folderPath, 'metadata.json');
  if (!fs.existsSync(metadataPath)) return null;

  const metadata = readJson(metadataPath);
  const platform = metadata.source?.platform;
  const mapper = platform === 'gfg' ? mapGfg : mapLeetCode;

  const solutionFile = findSolutionFile(folderPath);
  let code = null;
  if (solutionFile) {
    code = fs.readFileSync(path.join(folderPath, solutionFile), 'utf8');
  }

  const normalized = mapper(metadata);
  if (!normalized.slug) return null;

  // Attach the full solution code (falling back to the metadata's own code).
  normalized.submission = normalized.submission ?? {};
  if (!normalized.submission.code && code) {
    normalized.submission.code = code;
  }

  // githubPath — where the solution lives in the DSAForge output repo.
  const filename = solutionFile ?? 'solution';
  normalized.submission.githubPath =
    `${GITHUB_BASE}/blob/${GITHUB_BRANCH}/${githubFolderName(normalized.slug)}/${filename}`;

  normalized.folder = folderName;
  return normalized;
}

/**
 * Load every DSAForge problem from `backend/data/dsaForge/` as normalized
 * records ready to seed. Returns an array (empty if no folders present).
 */
function loadDsaForgeQuestions() {
  if (!fs.existsSync(DSA_FORGE_DIR)) return [];

  const folders = fs
    .readdirSync(DSA_FORGE_DIR, { withFileTypes: true })
    .filter((e) => e.isDirectory() && !e.name.startsWith('.'))
    .map((e) => e.name);

  const questions = [];
  for (const folderName of folders) {
    const question = importProblemFolder(
      path.join(DSA_FORGE_DIR, folderName),
      folderName,
    );
    if (question) questions.push(question);
  }
  return questions;
}

module.exports = { 
  loadDsaForgeQuestions, 
  GITHUB_BASE,
  mapLeetCode,
  mapGfg
};
