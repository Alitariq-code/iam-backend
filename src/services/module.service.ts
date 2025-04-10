import db from '../database/db.js';
import { Module } from '../models/module.model.js';

export const getAllModules = async (): Promise<Module[]> => {
  return db<Module>('modules').select('*');
};

export const getModuleById = async (id: number): Promise<Module | undefined> => {
  return db<Module>('modules').where({ id }).first();
};

export const createModule = async (name: string): Promise<Module> => {
  const [mod] = await db<Module>('modules').insert({ name }).returning('*');
  return mod;
};

export const updateModule = async (id: number, name: string): Promise<Module | undefined> => {
  const [updated] = await db<Module>('modules')
    .where({ id })
    .update({ name, updated_at: new Date() })
    .returning('*');
  return updated;
};

export const deleteModule = async (id: number): Promise<number> => {
  return db<Module>('modules').where({ id }).delete();
};
