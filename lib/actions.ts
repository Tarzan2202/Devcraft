'use server';

import { getDb } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { revalidatePath } from 'next/cache';
import { cookies } from 'next/headers';
import { SignJWT, jwtVerify } from 'jose';
import bcrypt from 'bcryptjs';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_GENERATIVE_AI_API_KEY || '');
const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET || 'default-secret-key-change-me');

// --- Helper Functions ---

async function generateVector(text: string): Promise<number[]> {
  try {
    const embedModel = genAI.getGenerativeModel({ model: "gemini-embedding-001" });
    const result = await embedModel.embedContent(text);
    
    if (result.embedding?.values) {
      return result.embedding.values;
    }
    throw new Error('โครงสร้างค่ายกกำลังเวกเตอร์ (Embedding) จาก API ไม่ถูกต้อง');
  } catch (error: any) {
    console.error('Failed to generate embedding:', error);
    throw new Error(`Embedding Generation Failed: ${error.message}`);
  }
}

// --- Project Actions ---

export async function getProjects() {
  try {
    const db = await getDb();
    const data = await db.collection('projects').find({}).sort({ createdAt: -1 }).toArray();
    return data.map(item => ({
      ...item,
      _id: item._id.toString(),
    })) as any;
  } catch (error) {
    console.error('Failed to get projects:', error);
    return [];
  }
}

export async function addProject(formData: any) {
  try {
    const db = await getDb();
    const newProject = {
      ...formData,
      createdAt: new Date()
    };
    await db.collection('projects').insertOne(newProject);
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('Add Project Error:', error);
    throw new Error(error.message);
  }
}

export async function updateProject(id: string, formData: any) {
  try {
    const db = await getDb();
    await db.collection('projects').updateOne(
      { _id: new ObjectId(id) },
      { $set: formData }
    );
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('Update Project Error:', error);
    throw new Error(error.message);
  }
}

export async function deleteProject(id: string) {
  try {
    const db = await getDb();
    await db.collection('projects').deleteOne({ _id: new ObjectId(id) });
    revalidatePath('/');
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Delete Project Error:', error);
    throw new Error('ไม่สามารถลบข้อมูลได้');
  }
}

// --- Knowledge Actions ---

export async function getKnowledge() {
  try {
    const db = await getDb();
    const data = await db.collection('knowledge').find({}).sort({ updatedAt: -1 }).toArray();
    return data.map(item => ({
      ...item,
      _id: item._id.toString(),
    })) as any;
  } catch (error) {
    console.error('Failed to get knowledge:', error);
    return [];
  }
}

export async function addKnowledge(formData: { title: string; content: string; category: string }) {
  try {
    const db = await getDb();
    const embedding = await generateVector(formData.content);
    const newKnowledge = {
      ...formData,
      embedding: embedding,
      updatedAt: new Date()
    };
    await db.collection('knowledge').insertOne(newKnowledge);
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('Add Knowledge Error:', error);
    throw new Error(error.message);
  }
}

export async function updateKnowledge(id: string, formData: { title: string; content: string; category: string }) {
  try {
    const db = await getDb();
    const embedding = await generateVector(formData.content);
    const updatedData = {
      ...formData,
      embedding: embedding,
      updatedAt: new Date()
    };
    await db.collection('knowledge').updateOne(
      { _id: new ObjectId(id) },
      { $set: updatedData }
    );
    revalidatePath('/admin');
    return { success: true };
  } catch (error: any) {
    console.error('Update Knowledge Error:', error);
    throw new Error(error.message);
  }
}

export async function deleteKnowledge(id: string) {
  try {
    const db = await getDb();
    await db.collection('knowledge').deleteOne({ _id: new ObjectId(id) });
    revalidatePath('/admin');
    return { success: true };
  } catch (error) {
    console.error('Delete Knowledge Error:', error);
    throw new Error('ไม่สามารถลบข้อมูลได้');
  }
}

// --- Auth Actions ---

export async function register(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const name = formData.get('name') as string;
    const phone = formData.get('phone') as string;

    const db = await getDb();
    const existingUser = await db.collection('users').findOne({ email });

    if (existingUser) {
      return { error: 'อีเมลนี้ถูกใช้งานแล้ว' };
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {
      email,
      password: hashedPassword,
      name,
      phone,
      role: 'user', // Default role
      createdAt: new Date()
    };

    await db.collection('users').insertOne(newUser);
    return { success: true };
  } catch (error) {
    console.error('Register Error:', error);
    return { error: 'เกิดข้อผิดพลาดในการลงทะเบียน' };
  }
}

export async function login(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    const db = await getDb();
    const user = await db.collection('users').findOne({ email });

    if (!user) {
      return { error: 'ไม่พบผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง' };
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return { error: 'ไม่พบผู้ใช้งานหรือรหัสผ่านไม่ถูกต้อง' };
    }

    const token = await new SignJWT({ 
      id: user._id.toString(), 
      email: user.email, 
      role: user.role 
    })
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('2h')
      .sign(JWT_SECRET);

    const cookieStore = await cookies();
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 2, // 2 hours
      path: '/',
    });

    return { success: true, role: user.role };
  } catch (error) {
    console.error('Login Error:', error);
    return { error: 'เกิดข้อผิดพลาดในการเข้าสู่ระบบ' };
  }
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('auth_token');
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('auth_token')?.value;

    if (!token) return null;

    const { payload } = await jwtVerify(token, JWT_SECRET);
    const db = await getDb();
    const user = await db.collection('users').findOne({ _id: new ObjectId(payload.id as string) });

    if (!user) return null;

    return {
      id: user._id.toString(),
      email: user.email,
      name: user.name,
      role: user.role,
    };
  } catch (error) {
    return null;
  }
}

export async function getAdminStatus() {
  try {
    const db = await getDb();
    const [projectCount, userCount, knowledgeCount] = await Promise.all([
      db.collection('projects').countDocuments(),
      db.collection('users').countDocuments(),
      db.collection('knowledge').countDocuments()
    ]);

    return {
      dbConnected: true,
      projectCount,
      userCount,
      knowledgeCount
    };
  } catch (error) {
    return {
      dbConnected: false,
      projectCount: 0,
      userCount: 0,
      knowledgeCount: 0
    };
  }
}
