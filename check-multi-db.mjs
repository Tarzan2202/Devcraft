import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

async function run() {
  if (!uri) {
    console.error('MONGODB_URI is not defined');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();
    console.log(`Current DB: "${db.databaseName}"`);
    
    // 1. Check all databases
    const adminDb = client.db().admin();
    const dbs = await adminDb.listDatabases();
    console.log('All databases in cluster:');
    dbs.databases.forEach(d => console.log(`  - ${d.name}`));

    // 2. Check collections and document counts in CURRENT DB
    const collections = await db.listCollections().toArray();
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`Collection "${col.name}" in "${db.databaseName}" has ${count} documents`);
    }

    // 3. Try to find projects in OTHER databases if they exist
    const targetDbName = 'devcraft-studio'; // Common name for this project
    const otherDb = client.db(targetDbName);
    const otherProjectsCount = await otherDb.collection('projects').countDocuments().catch(() => 0);
    console.log(`Collection "projects" in "${targetDbName}" has ${otherProjectsCount} documents`);

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

run();
