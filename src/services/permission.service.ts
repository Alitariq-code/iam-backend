import db from '../database/db.js';
import { Permission } from '../models/permission.model.js';

// ✨ Return permissions with populated module name
export const getAllPermissions = async () => {
  const rows = await db('permissions as p')
    .join('modules as m', 'p.module_id', 'm.id')
    .select('p.id', 'p.action', 'p.module_id', 'm.name as module_name', 'p.created_at', 'p.updated_at');

  return rows.map(row => ({
    id: row.id,
    action: row.action,
    module: {
      id: row.module_id,
      name: row.module_name,
    },
    created_at: row.created_at,
    updated_at: row.updated_at,
  }));
};

// ✨ Get one permission with populated module name
export const getPermissionById = async (id: number) => {
  const row = await db('permissions as p')
    .join('modules as m', 'p.module_id', 'm.id')
    .select('p.id', 'p.action', 'p.module_id', 'm.name as module_name', 'p.created_at', 'p.updated_at')
    .where('p.id', id)
    .first();

  if (!row) return undefined;

  return {
    id: row.id,
    action: row.action,
    module: {
      id: row.module_id,
      name: row.module_name,
    },
    created_at: row.created_at,
    updated_at: row.updated_at,
  };
};

// ✅ Insert a new permission
export const createPermission = async (
  action: Permission['action'],
  module_id: number
): Promise<Permission> => {
  const [perm] = await db<Permission>('permissions')
    .insert({ action, module_id })
    .returning('*');
  return perm;
};

// ✅ Update permission
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

// ✅ Delete permission
export const deletePermission = async (id: number): Promise<number> => {
  return db<Permission>('permissions').where({ id }).delete();
};

// ✅ Assign multiple permissions to role
export const assignPermissionsToRole = async (roleId: number, permissionIds: number[]) => {
  const data = permissionIds.map((pid) => ({
    role_id: roleId,
    permission_id: pid,
  }));

  await db('roles_permissions').insert(data).onConflict(['role_id', 'permission_id']).ignore();
};

// ✅ Get inherited permissions for a user
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
