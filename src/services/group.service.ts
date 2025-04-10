import db from '../database/db.js';
import { Group } from '../models/group.model.js';

export const getAllGroups = async (): Promise<Group[]> => {
  return db<Group>('groups').select('*');
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
