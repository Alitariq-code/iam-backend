
import db from '../database/db.js';
import { Role } from '../models/role.model.js';

export const getAllRoles = async (): Promise<Role[]> => {
  return db<Role>('roles').select('*');
};

export const getRoleById = async (id: number): Promise<Role | undefined> => {
  return db<Role>('roles').where({ id }).first();
};

export const createRole = async (name: string): Promise<Role> => {
  const [role] = await db<Role>('roles').insert({ name }).returning('*');
  return role;
};

export const updateRole = async (id: number, name: string): Promise<Role | undefined> => {
  const [updated] = await db<Role>('roles')
    .where({ id })
    .update({ name, updated_at: new Date() })
    .returning('*');
  return updated;
};

export const deleteRole = async (id: number): Promise<number> => {
  return db<Role>('roles').where({ id }).delete();
};

export const assignRolesToGroup = async (groupId: number, roleIds: number[]) => {
  const data = roleIds.map((roleId) => ({
    group_id: groupId,
    role_id: roleId,
  }));

  await db('groups_roles')
    .insert(data)
    .onConflict(['group_id', 'role_id'])
    .ignore();
};
