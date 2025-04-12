import { Request, Response } from 'express';
import {
  getAllPermissions,
  getPermissionById,
  createPermission,
  updatePermission,
  deletePermission,
  assignPermissionsToRole,
  getUserPermissions
} from '../services/permission.service.js';
import db from '../database/db.js';

export const listPermissions = async (_req: Request, res: Response):Promise<any>  => {
  try {
    const perms = await getAllPermissions();
    res.json({ status: 'success', permissions: perms });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getPermission = async (req: Request, res: Response):Promise<any>  => {
  try {
    const id = Number(req.params.id);
    const perm = await getPermissionById(id);
    if (!perm) return res.status(404).json({ status: 'error', message: 'Permission not found' });
    res.json({ status: 'success', permission: perm });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createNewPermission = async (req: Request, res: Response):Promise<any>  => {
  try {
    const { action, module_id } = req.body;

    if (!['create', 'read', 'update', 'delete'].includes(action)) {
      return res.status(400).json({ status: 'error', message: 'Invalid action' });
    }

    const module = await db('modules').where({ id: module_id }).first();
    if (!module) {
      return res.status(404).json({ status: 'error', message: 'Module not found' });
    }

    const perm = await createPermission(action, module_id);
    res.status(201).json({ status: 'success', permission: perm });
  } catch (error: any) {
    const isUnique = error?.code === 'SQLITE_CONSTRAINT' || error?.code === '23505';
    res.status(400).json({
      status: 'error',
      message: isUnique ? 'Permission already exists for this module/action' : error.message,
    });
  }
};

export const updatePermissionById = async (req: Request, res: Response) :Promise<any> => {
  try {
    const id = Number(req.params.id);
    const { action, module_id } = req.body;

    const updated = await updatePermission(id, action, module_id);
    if (!updated) return res.status(404).json({ status: 'error', message: 'Permission not found' });

    res.json({ status: 'success', permission: updated });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const removePermission = async (req: Request, res: Response) :Promise<any> => {
  try {
    const id = Number(req.params.id);
    const deleted = await deletePermission(id);
    if (!deleted) return res.status(404).json({ status: 'error', message: 'Permission not found' });
    res.json({ status: 'success', message: 'Permission deleted' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};

export const addPermissionsToRole = async (req: Request, res: Response):Promise<any>  => {
  try {
    const roleId = Number(req.params.roleId);
    console.log('Role ID:', roleId);
    console.log('Request Body:', req.body);
    const { permissionIds } = req.body;

    const role = await db('roles').where({ id: roleId }).first();
    if (!role) {
      return res.status(404).json({ status: 'error', message: 'Role not found' });
    }

    const valid = await db('permissions').whereIn('id', permissionIds);
    const existing = valid.map((p) => p.id);
    const missing = permissionIds.filter((id: number) => !existing.includes(id));
    if (missing.length) {
      return res.status(404).json({ status: 'error', message: `Permissions not found: ${missing.join(', ')}` });
    }

    await assignPermissionsToRole(roleId, permissionIds);
    res.json({ status: 'success', message: 'Permissions assigned to role' });
  } catch (error: any) {
    res.status(500).json({ status: 'error', message: error.message });
  }
};


export const getMyPermissions = async (req: Request, res: Response):Promise<any> => {
    try {
      const userId = (req as any).user?.id;
      console.log('User ID:', userId);
  
      if (!userId) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
      }
  
      const permissions = await getUserPermissions(userId);
      return res.json({ status: 'success', permissions });
    } catch (err: any) {
      return res.status(500).json({ status: 'error', message: err.message });
    }
  };
  
  export const simulateAction = async (req: Request, res: Response):Promise<any> => {
    try {
      const { module, action } = req.body;
      const userId = (req as any).user?.id;

      console.log(userId,'userId')
  
      if (!userId) {
        return res.status(401).json({ status: 'error', message: 'Unauthorized' });
      }
  
      const permissions = await getUserPermissions(userId);
  
      const allowed = permissions.some(
        (perm: any) => perm.module === module && perm.action === action
      );
  
      return res.json({
        status: 'success',
        allowed,
        module,
        action,
      });
    } catch (err: any) {
      return res.status(500).json({ status: 'error', message: err.message });
    }
  };