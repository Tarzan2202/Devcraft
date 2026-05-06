import { MongoClient } from 'mongodb';

const uri = process.env.MONGODB_URI;

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const project = await db.collection('projects').findOne({});
    if (project && project.imageUrl) {
      console.log('ImageUrl length:', project.imageUrl.length);
      console.log('ImageUrl starts with:', project.imageUrl.substring(0, 50));
    } else {
      console.log('No project or no imageUrl found');
    }
  } finally {
    await client.close();
  }
}
run();
