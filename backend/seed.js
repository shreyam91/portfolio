const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const DSAQuestion = require('./models/DSAQuestion');
const MachineCodingQuestion = require('./models/MachineCodingQuestion');
const SystemDesignQuestion = require('./models/SystemDesignQuestion');
const Blog = require('./models/Blog');
const Project = require('./models/Project');
const Resource = require('./models/Resource');

const dsaData = require('./data/dsaQuestions.json');
const mcData = require('./data/machineCodingQuestions.json');
const sdData = require('./data/systemDesignQuestions.json');
const blogData = require('./data/blogs.json');
const projectData = require('./data/projects.json');
const resourceData = require('./data/resources.json');

// Upsert a list of items into a model, matching on `title`
const upsertMany = async (Model, items) => {
  const ops = items.map(({ id, _id, ...data }) => ({
    updateOne: {
      filter: { title: data.title },
      update: { $set: data },
      upsert: true,
    },
  }));
  const result = await Model.bulkWrite(ops);
  return result;
};

const seedData = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/codestreak';
    await mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true });
    console.log('Connected to MongoDB');

    const [dsa, mc, sd, blogs, projects, resources] = await Promise.all([
      upsertMany(DSAQuestion, dsaData),
      upsertMany(MachineCodingQuestion, mcData),
      upsertMany(SystemDesignQuestion, sdData),
      upsertMany(Blog, blogData),
      upsertMany(Project, projectData),
      upsertMany(Resource, resourceData),
    ]);

    console.log(`DSA          — inserted: ${dsa.upsertedCount}, updated: ${dsa.modifiedCount}`);
    console.log(`MachineCoding— inserted: ${mc.upsertedCount}, updated: ${mc.modifiedCount}`);
    console.log(`SystemDesign — inserted: ${sd.upsertedCount}, updated: ${sd.modifiedCount}`);
    console.log(`Blogs        — inserted: ${blogs.upsertedCount}, updated: ${blogs.modifiedCount}`);
    console.log(`Projects     — inserted: ${projects.upsertedCount}, updated: ${projects.modifiedCount}`);
    console.log(`Resources    — inserted: ${resources.upsertedCount}, updated: ${resources.modifiedCount}`);

    console.log('\nSeed complete. No data was deleted.');
    process.exit(0);
  } catch (err) {
    console.error('Error seeding data:', err);
    process.exit(1);
  }
};

seedData();
