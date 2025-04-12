
import db from '../database/db.js';
import { Role } from '../models/role.model.js';

export const getAllRoles = async () => {
  const roles = await db<Role>('roles').select('*');

  const enrichedRoles = await Promise.all(
    roles.map(async (role) => {
      const groups = await db('groups_roles as gr')
        .join('groups as g', 'gr.group_id', 'g.id')
        .where('gr.role_id', role.id)
        .select('g.id', 'g.name');

      return {
        ...role,
        groups,
      };
    })
  );

  return enrichedRoles;
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
