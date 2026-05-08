import React from 'react';
import { getProjects } from '@/lib/actions';
import HomeClient from './HomeClient';
import { Project } from '@/lib/types';

export const dynamic = 'force-dynamic';

export default async function HomePage() {
  let projects: Project[] = [];
  let dbError = false;

  try {
    projects = await getProjects();
  } catch (error: any) {
    console.error('Failed to fetch projects', error);
    if (error.message === 'DATABASE_NOT_CONFIGURED') {
      dbError = true;
    }
  }

  return <HomeClient initialProjects={projects} dbError={dbError} />;
}
