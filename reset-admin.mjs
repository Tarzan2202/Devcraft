import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';

// Change this to your desired new password
const NEW_PASSWORD = 'Peeravich';
const ADMIN_EMAIL = 'peeravich22@gmail.com'; 

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
    
    console.log(`Resetting password for: ${ADMIN_EMAIL}`);
    
    const hashedPassword = await bcrypt.hash(NEW_PASSWORD, 10);
    
    const result = await db.collection('users').updateOne(
      { email: ADMIN_EMAIL },
      { $set: { password: hashedPassword, role: 'admin' } }
    );

    if (result.matchedCount === 0) {
      console.log('User not found. Creating new admin user...');
      await db.collection('users').insertOne({
        name: 'Admin',
        email: ADMIN_EMAIL,
        password: hashedPassword,
        role: 'admin',
        createdAt: new Date()
      });
      console.log('New admin user created successfully.');
    } else {
      console.log('Admin password updated successfully.');
    }

  } catch (err) {
    console.error('Error:', err);
  } finally {
    await client.close();
  }
}

run();
