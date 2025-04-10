// src/controllers/role.controller.ts
import { Request, Response } from 'express';
import {
  getAllRoles,
  getRoleById,
  createRole,
  updateRole,
  deleteRole,
  assignRolesToGroup,
} from '../services/role.service.js';
import { getGroupById } from '../services/group.service.js';
import db from '../database/db.js';

export const listRoles = async (_req: Request, res: Response) => {
  try {
    const roles = await getAllRoles();
    res.json({ status: 'success', roles });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getRole = async (req: Request, res: Response) : Promise<any> => {
  try {
    const id = Number(req.params.id);
    const role = await getRoleById(id);
    if (!role) return res.status(404).json({ status: 'error', message: 'Role not found' });
    res.json({ status: 'success', role });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createNewRole = async (req: Request, res: Response): Promise<any>  => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ status: 'error', message: 'Role name is required' });

    const role = await createRole(name);
    res.status(201).json({ status: 'success', role });
  } catch (error: any) {
    const isUnique = error?.code === 'SQLITE_CONSTRAINT' || error?.code === '23505';
    res.status(400).json({
      status: 'error',
      message: isUnique ? 'Role name already exists' : error.message,
    });
  }
};

export const updateRoleById = async (req: Request, res: Response): Promise<any>  => {
  try {
    const id = Number(req.params.id);
    const { name } = req.body;
    const updated = await updateRole(id, name);
    if (!updated) return res.status(404).json({ status: 'error', message: 'Role not found' });
    res.json({ status: 'success', role: updated });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const removeRole = async (req: Request, res: Response): Promise<any>  => {
  try {
    const id = Number(req.params.id);
    const deleted = await deleteRole(id);
    if (!deleted) return res.status(404).json({ status: 'error', message: 'Role not found' });
    res.json({ status: 'success', message: 'Role deleted' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const addRolesToGroup = async (req: Request, res: Response): Promise<any>  => {
  try {
    const groupId = Number(req.params.groupId);
    const { roleIds } = req.body;

    if (!Array.isArray(roleIds) || roleIds.length === 0) {
      return res.status(400).json({ status: 'error', message: 'roleIds must be a non-empty array' });
    }

    const allValid = roleIds.every((id) => typeof id === 'number');
    if (!allValid) {
      return res.status(400).json({ status: 'error', message: 'All roleIds must be numbers' });
    }

    const group = await getGroupById(groupId);
    if (!group) {
      return res.status(404).json({ status: 'error', message: 'Group not found' });
    }

    const existingRoles = await db('roles').whereIn('id', roleIds).select('id');
    const foundIds = existingRoles.map((r) => r.id);
    const missing = roleIds.filter((id) => !foundIds.includes(id));

    if (missing.length > 0) {
      return res.status(404).json({
        status: 'error',
        message: `Roles not found: ${missing.join(', ')}`,
      });
    }

    await assignRolesToGroup(groupId, roleIds);
    res.json({ status: 'success', message: 'Roles assigned to group' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};
