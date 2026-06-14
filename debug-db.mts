
import { MongoClient } from 'mongodb';

const uri = " ";

async function test() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    const collection = db.collection('knowledge');
    const items = await collection.find({}).limit(10).toArray();
    console.log('Knowledge Items Count:', items.length);
    console.log('Items Preview:', JSON.stringify(items.map(i => ({
      _id: i._id,
      title: i.title,
      hasEmbedding: !!i.embedding,
      embeddingLength: i.embedding?.length,
      contentPreview: i.content?.substring(0, 50)
    })), null, 2));

    // Check search indexes
    try {
        const indexes = await collection.listSearchIndexes().toArray();
        console.log('Search Indexes:', JSON.stringify(indexes, null, 2));
    } catch (e) {
        console.log('Could not list search indexes (maybe not Atlas or permission issue):', e.message);
    }

  } catch (err) {
    console.error(err);
  } finally {
    await client.close();
  }
}

test();
