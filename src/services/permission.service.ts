import db from '../database/db.js';
import { Permission } from '../models/permission.model.js';

export const getAllPermissions = async (): Promise<Permission[]> => {
  return db<Permission>('permissions').select('*');
};

export const getPermissionById = async (id: number): Promise<Permission | undefined> => {
  return db<Permission>('permissions').where({ id }).first();
};

export const createPermission = async (
  action: Permission['action'],
  module_id: number
): Promise<Permission> => {
  const [perm] = await db<Permission>('permissions').insert({ action, module_id }).returning('*');
  return perm;
};

export const updatePermission = async (
  id: number,
  action: Permission['action'],
  module_id: number
): Promise<Permission | undefined> => {
  const [updated] = await db<Permission>('permissions')
    .where({ id })
    .update({ action, module_id, updated_at: new Date() })
    .returning('*');
  return updated;
};

export const deletePermission = async (id: number): Promise<number> => {
  return db<Permission>('permissions').where({ id }).delete();
};

export const assignPermissionsToRole = async (roleId: number, permissionIds: number[]) => {
  const data = permissionIds.map((pid) => ({
    role_id: roleId,
    permission_id: pid,
  }));

  await db('roles_permissions').insert(data).onConflict(['role_id', 'permission_id']).ignore();
};

export const getUserPermissions = async (userId: number) => {
    return db('users_groups as ug')
      .join('groups as g', 'ug.group_id', 'g.id')
      .join('groups_roles as gr', 'g.id', 'gr.group_id')
      .join('roles as r', 'gr.role_id', 'r.id')
      .join('roles_permissions as rp', 'r.id', 'rp.role_id')
      .join('permissions as p', 'rp.permission_id', 'p.id')
      .join('modules as m', 'p.module_id', 'm.id')
      .where('ug.user_id', userId)
      .distinct(['p.action', 'm.name as module']);
  };
