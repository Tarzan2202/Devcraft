import { MongoClient, Db } from 'mongodb';

const uri = process.env.MONGODB_URI;
if (!uri) {
  console.warn('WARNING: MONGODB_URI is not defined in environment variables');
}
const options = {};

let client: MongoClient;
let clientPromise: Promise<MongoClient> | null = null;

if (uri) {
  if (process.env.NODE_ENV === 'development') {
    let globalWithMongo = global as typeof globalThis & {
      _mongoClientPromise?: Promise<MongoClient>;
    };

    if (!globalWithMongo._mongoClientPromise) {
      client = new MongoClient(uri, options);
      globalWithMongo._mongoClientPromise = client.connect();
    }
    clientPromise = globalWithMongo._mongoClientPromise;
  } else {
    client = new MongoClient(uri, options);
    clientPromise = client.connect();
  }
}

export default clientPromise;

export async function getDb(): Promise<Db> {
  if (!clientPromise) {
    throw new Error('MISSING_MONGODB_URI');
  }
  const client = await clientPromise;
  const db = client.db();
  console.log(`Connected to MongoDB database: "${db.databaseName}"`);
  return db;
}
