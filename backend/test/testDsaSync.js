require('dotenv').config({ path: __dirname + '/../.env' });
const mongoose = require('mongoose');
const env = require('../src/config/env');
const { syncDsaForgeFromGithub } = require('../src/services/dsaForgeImport');

async function runTest() {
  try {
    await mongoose.connect(env.mongodbUri);
    console.log('Connected to DB. Starting sync...');
    const result = await syncDsaForgeFromGithub();
    console.log('Sync result:', result);
  } catch (err) {
    console.error('Test failed:', err);
  } finally {
    await mongoose.disconnect();
    console.log('Disconnected from DB.');
  }
}

runTest();
