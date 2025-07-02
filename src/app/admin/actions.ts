'use server';

import fs from 'fs/promises';
import path from 'path';
import type { AdminConfig } from '@/lib/types';

const configPath = path.join(process.cwd(), 'src', 'data', 'admin-config.json');

export async function getAdminConfig(): Promise<AdminConfig> {
  try {
    const fileContent = await fs.readFile(configPath, 'utf-8');
    return JSON.parse(fileContent);
  } catch (error) {
    console.error('Failed to read admin config:', error);
    throw new Error('Could not load admin configuration.');
  }
}

export async function saveAdminConfig(data: AdminConfig): Promise<{ success: boolean; message: string }> {
  try {
    const jsonString = JSON.stringify(data, null, 2);
    await fs.writeFile(configPath, jsonString, 'utf-8');
    return { success: true, message: 'Settings saved successfully!' };
  } catch (error) {
    console.error('Failed to save admin config:', error);
    return { success: false, message: 'Failed to save settings.' };
  }
}
