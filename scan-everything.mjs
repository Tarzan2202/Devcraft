import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const admin = client.db().admin();
    const dbs = await admin.listDatabases();
    
    console.log('Scanning all databases...');
    for (const dbInfo of dbs.databases) {
      const db = client.db(dbInfo.name);
      const collections = await db.listCollections().toArray();
      console.log(`Database: "${dbInfo.name}"`);
      if (collections.length === 0) {
        console.log('  (No collections)');
      }
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        console.log(`  - Collection: "${col.name}", Documents: ${count}`);
      }
    }
  } finally {
    await client.close();
  }
}
run();
