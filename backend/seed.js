const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const DSAQuestion = require('./models/DSAQuestion');
const MachineCodingQuestion = require('./models/MachineCodingQuestion');
const SystemDesignQuestion = require('./models/SystemDesignQuestion');
const Blog = require('./models/Blog');
const Project = require('./models/Project');
const Resource = require('./models/Resource');

const { loadDsaForgeQuestions } = require('./src/services/dsaForgeImport');

const dsaData = loadDsaForgeQuestions();
const mcData = require('./data/machineCodingQuestions.json');
const sdData = require('./data/systemDesignQuestions.json');
const blogData = require('./data/blogs.json');
const projectData = require('./data/projects.json');
const resourceData = require('./data/resources.json');

// Upsert a list of items into a model, matching on `title`
const replaceAll = async (Model, items) => {
  await Model.deleteMany({});
  const cleanItems = items.map(({ id, _id, ...data }) => data);
  const result = await Model.insertMany(cleanItems);
  return { upsertedCount: result.length, modifiedCount: 0 };
};

// Upsert DSA questions, matching on `{ platform, slug }` (DSAForge source of truth)
const upsertDSA = async (Model, items) => {
  const ops = items.map(({ id, _id, folder, ...data }) => ({
    updateOne: {
      filter: { platform: data.platform, slug: data.slug },
      update: { $set: data },
      upsert: true,
    },
  }));
  const result = await Model.bulkWrite(ops);
  return result;
};

// DSAForge is the single source of truth — remove any DSA rows that no longer
// exist in the imported metadata (e.g. left over from the old curated dataset).
const pruneStaleDSA = async (Model, items) => {
  const kept = items.map((i) => ({ platform: i.platform, slug: i.slug }));
  const result = await Model.deleteMany({
    $nor: kept.map((k) => ({ platform: k.platform, slug: k.slug })),
  });
  return result.deletedCount;
};

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/codestreak';
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const [dsa, stalled = 0, mc, sd, blogs, projects, resources] = await Promise.all([
      upsertDSA(DSAQuestion, dsaData),
      pruneStaleDSA(DSAQuestion, dsaData),
      replaceAll(MachineCodingQuestion, mcData),
      replaceAll(SystemDesignQuestion, sdData),
      replaceAll(Blog, blogData),
      replaceAll(Project, projectData),
      replaceAll(Resource, resourceData),
    ]);

    console.log(`DSA          — inserted: ${dsa.upsertedCount}, updated: ${dsa.modifiedCount}, pruned stale: ${stalled}`);
    console.log(`MachineCoding— inserted: ${mc.upsertedCount}, updated: ${mc.modifiedCount}`);
    console.log(`SystemDesign — inserted: ${sd.upsertedCount}, updated: ${sd.modifiedCount}`);
    console.log(`Blogs        — inserted: ${blogs.upsertedCount}, updated: ${blogs.modifiedCount}`);
    console.log(`Projects     — inserted: ${projects.upsertedCount}, updated: ${projects.modifiedCount}`);
    console.log(`Resources    — inserted: ${resources.upsertedCount}, updated: ${resources.modifiedCount}`);

    console.log('\nSeed complete. DSA content pruned to match DSAForge metadata.');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedData();
