import db from '../database/db.js';
import { Group } from '../models/group.model.js';

export const getAllGroups = async () => {
  const groups = await db('groups').select('*');

  const enrichedGroups = await Promise.all(
    groups.map(async (group) => {
      const users = await db('users_groups as ug')
        .join('users as u', 'ug.user_id', 'u.id')
        .where('ug.group_id', group.id)
        .select('u.id', 'u.username', 'u.email');

      return {
        ...group,
        users,
      };
    })
  );

  return enrichedGroups;
};


export const getGroupById = async (id: number): Promise<Group | undefined> => {
  return db<Group>('groups').where({ id }).first();
};

export const createGroup = async (name: string): Promise<Group> => {
  const [group] = await db<Group>('groups').insert({ name }).returning('*');
  return group;
};

export const updateGroup = async (id: number, name: string): Promise<Group | undefined> => {
  const [updated] = await db<Group>('groups')
    .where({ id })
    .update({ name, updated_at: new Date() })
    .returning('*');
  return updated;
};

export const deleteGroup = async (id: number): Promise<number> => {
  return db<Group>('groups').where({ id }).delete();
};

export const assignUsersToGroup = async (groupId: number, userIds: number[]) => {
  const data = userIds.map((userId) => ({
    user_id: userId,
    group_id: groupId,
  }));

  // Insert while ignoring duplicates
  await db('users_groups')
    .insert(data)
    .onConflict(['user_id', 'group_id'])
    .ignore();
};
