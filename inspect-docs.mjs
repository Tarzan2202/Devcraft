import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const project = await db.collection('projects').findOne({});
    console.log('Project Document:', JSON.stringify(project, null, 2));
    
    const users = await db.collection('users').find({}).toArray();
    console.log('Users (without passwords):', users.map(u => ({ email: u.email, role: u.role })));
  } finally {
    await client.close();
  }
}
run();
