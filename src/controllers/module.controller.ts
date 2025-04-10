import { Request, Response } from 'express';
import {
  getAllModules,
  getModuleById,
  createModule,
  updateModule,
  deleteModule,
} from '../services/module.service.js';

export const listModules = async (_req: Request, res: Response):Promise<any>  => {
  try {
    const modules = await getAllModules();
    res.json({ status: 'success', modules });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getModule = async (req: Request, res: Response):Promise<any>  => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ status: 'error', message: 'Invalid ID' });

    const mod = await getModuleById(id);
    if (!mod) return res.status(404).json({ status: 'error', message: 'Module not found' });

    res.json({ status: 'success', module: mod });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createNewModule = async (req: Request, res: Response):Promise<any>  => {
  try {
    const { name } = req.body;
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ status: 'error', message: 'Module name is required' });
    }

    const mod = await createModule(name);
    res.status(201).json({ status: 'success', module: mod });
  } catch (error: any) {
    const isUnique = error?.code === 'SQLITE_CONSTRAINT' || error?.code === '23505';
    res.status(400).json({
      status: 'error',
      message: isUnique ? 'Module name already exists' : error.message,
    });
  }
};

export const updateModuleById = async (req: Request, res: Response):Promise<any>  => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;

    if (isNaN(id)) return res.status(400).json({ status: 'error', message: 'Invalid ID' });
    if (!name || typeof name !== 'string') {
      return res.status(400).json({ status: 'error', message: 'Module name is required' });
    }

    const updated = await updateModule(id, name);
    if (!updated) return res.status(404).json({ status: 'error', message: 'Module not found' });

    res.json({ status: 'success', module: updated });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const removeModule = async (req: Request, res: Response):Promise<any>  => {
  try {
    const id = Number(req.params.id);
    if (isNaN(id)) return res.status(400).json({ status: 'error', message: 'Invalid ID' });

    const deleted = await deleteModule(id);
    if (!deleted) return res.status(404).json({ status: 'error', message: 'Module not found' });

    res.json({ status: 'success', message: 'Module deleted' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
