import { ObjectId } from 'mongodb';

export interface Project {
  _id?: string | ObjectId;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  techStack: string[];
  liveUrl?: string;
  githubUrl?: string;
  featured: boolean;
  createdAt: Date;
}

export interface User {
  _id?: string | ObjectId;
  email: string;
  password?: string;
  name: string;
  phone?: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface AdminStatus {
  dbConnected: boolean;
  projectCount: number;
  userCount: number;
}
