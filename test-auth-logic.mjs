import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

const uri = process.env.MONGODB_URI;

async function run() {
  const client = new MongoClient(uri);
  try {
    await client.connect();
    const db = client.db();
    
    const email = 'peeravich22@gmail.com';
    const password = '...'; // I don't know the real password, but I can test the logic
    
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      console.log('User not found');
      return;
    }

    console.log('User found:', user.email);
    console.log('Password hash exists:', !!user.password);
    
    // Test a dummy password just to see if bcrypt doesn't throw
    try {
      const match = await bcrypt.compare('wrong-password', user.password);
      console.log('Bcrypt comparison works (match should be false):', match);
    } catch (e) {
      console.error('Bcrypt comparison failed with error:', e);
    }

  } finally {
    await client.close();
  }
}
run();
