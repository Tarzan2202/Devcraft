'use server';

import { Db, ObjectId } from 'mongodb';
import { Project, User, AdminStatus } from './types';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import { getDb as getDbHelper } from './mongodb';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'fallback_secret_keep_it_safe'
);

async function getDb(): Promise<Db> {
  return getDbHelper();
}

// --- Auth Actions ---

export async function login(formData: FormData) {
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;

  try {
    const db = await getDb();
    console.log(`[Login] Attempting to find user with email: ${email}`);
    const user = await db.collection<User>('users').findOne({ email });

    if (!user || !user.password) {
      console.log(`[Login] User not found: ${email}`);
      return { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
    }

    const isValid = await bcrypt.compare(password, user.password);
    if (!isValid) {
      console.log(`[Login] Invalid password for: ${email}`);
      return { error: 'อีเมลหรือรหัสผ่านไม่ถูกต้อง' };
    }

    const token = await new SignJWT({ 
      userId: user._id?.toString(),
      role: user.role,
      email: user.email 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('24h')
      .sign(JWT_SECRET);

    (await cookies()).set('session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production' && !process.env.APP_URL?.includes('localhost'),
      sameSite: 'lax',
      path: '/',
    });

    return { success: true, role: user.role };
  } catch (error: any) {
    console.error('Login error:', error);
    if (error.message === 'MISSING_MONGODB_URI') {
      return { error: 'ไม่พบการตั้งค่าฐานข้อมูล (MONGODB_URI) โปรดตรวจสอบไฟล์ .env' };
    }
    return { error: 'เกิดข้อผิดพลาดที่ไม่คาดคิด โปรดลองใหม่อีกครั้ง' };
  }
}

export async function register(formData: FormData) {
  const name = formData.get('name') as string;
  const email = formData.get('email') as string;
  const password = formData.get('password') as string;
  const phone = formData.get('phone') as string;

  try {
    const db = await getDb();
    console.log(`[Register] Checking if user exists: ${email}`);
    const existingUser = await db.collection('users').findOne({ email });

    if (existingUser) {
      console.log(`[Register] User already exists: ${email}`);
      return { error: 'Email already registered' };
    }

    const userCount = await db.collection('users').countDocuments();
    console.log(`[Register] Current user count: ${userCount}`);
    const role = userCount === 0 ? 'admin' : 'user';

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser: Omit<User, '_id'> = {
      name,
      email,
      password: hashedPassword,
      phone,
      role,
      createdAt: new Date(),
    };

    console.log(`[Register] Inserting new user: ${email} with role: ${role}`);
    await db.collection('users').insertOne(newUser);
    return { success: true };
  } catch (error) {
    console.error('[Register] CRITICAL ERROR:', error);
    return { error: 'An unexpected error occurred' };
  }
}

export async function logout() {
  (await cookies()).delete('session');
}

export async function getCurrentUser(): Promise<User | null> {
  const session = (await cookies()).get('session')?.value;
  if (!session) return null;

  try {
    const { payload } = await jwtVerify(session, JWT_SECRET);
    if (!payload.userId || typeof payload.userId !== 'string' || payload.userId.length !== 24) {
      console.warn('[getCurrentUser] Invalid userId in token:', payload.userId);
      return null;
    }
    const db = await getDb();
    const user = await db.collection<User>('users').findOne({ 
      _id: new ObjectId(payload.userId) 
    });

    if (!user) return null;
    
    // Remove password from memory
    const { password, ...userWithoutPassword } = user;
    return {
      ...userWithoutPassword,
      _id: user._id?.toString()
    } as User;
  } catch (error) {
    return null;
  }
}

// --- Admin Actions ---

export async function getAdminStatus(): Promise<AdminStatus> {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  try {
    const db = await getDb();
    const projectCount = await db.collection('projects').countDocuments();
    const userCount = await db.collection('users').countDocuments();
    
    return {
      dbConnected: true,
      projectCount,
      userCount
    };
  } catch (error) {
    console.error('Failed to get status:', error);
    return {
      dbConnected: false,
      projectCount: 0,
      userCount: 0
    };
  }
}

export async function getAllUsers(): Promise<User[]> {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const db = await getDb();
  const users = await db.collection<User>('users').find({}).toArray();
  return users.map(u => ({
    ...u,
    _id: u._id?.toString(),
    password: undefined // Safety
  })) as User[];
}

export async function updateUser(id: string, updates: Partial<User>) {
  const currentUser = await getCurrentUser();
  if (!currentUser || currentUser.role !== 'admin') {
    throw new Error('Unauthorized');
  }

  const db = await getDb();
  const { _id, password, ...safeUpdates } = updates;
  
  const updatePayload: any = { ...safeUpdates };
  if (password) {
    updatePayload.password = await bcrypt.hash(password, 10);
  }
  
  await db.collection('users').updateOne(
    { _id: new ObjectId(id) },
    { $set: updatePayload }
  );
  
  revalidatePath('/admin');
  return { success: true };
}

// --- Project Actions ---

export async function getProjects() {
  try {
    const db = await getDb();
    const projects = await db.collection('projects').find({}).sort({ createdAt: -1 }).toArray();
    console.log(`[getProjects] Found ${projects.length} projects`);
    return projects.map(p => ({
      ...p,
      _id: p._id.toString(),
      imageUrl: p.imageUrl
    })) as Project[];
  } catch (error: any) {
    console.error('Failed to fetch projects:', error);
    if (error.message === 'MISSING_MONGODB_URI') {
      throw new Error('DATABASE_NOT_CONFIGURED');
    }
    return [];
  }
}

export async function addProject(project: Omit<Project, '_id' | 'createdAt'>) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') throw new Error('Unauthorized');

  const db = await getDb();
  const newProject = {
    ...project,
    createdAt: new Date(),
  };
  const result = await db.collection('projects').insertOne(newProject);
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true, id: result.insertedId.toString() };
}

export async function updateProject(id: string, project: Partial<Project>) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') throw new Error('Unauthorized');

  const db = await getDb();
  const { _id, ...updateData } = project;
  await db.collection('projects').updateOne(
    { _id: new ObjectId(id) },
    { $set: updateData }
  );
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}

export async function deleteProject(id: string) {
  const user = await getCurrentUser();
  if (!user || user.role !== 'admin') throw new Error('Unauthorized');

  const db = await getDb();
  await db.collection('projects').deleteOne({ _id: new ObjectId(id) });
  revalidatePath('/');
  revalidatePath('/admin');
  return { success: true };
}
