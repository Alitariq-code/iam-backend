import { Request, Response } from 'express';
import {
  getAllGroups,
  getGroupById,
  createGroup,
  updateGroup,
  deleteGroup,
  assignUsersToGroup,
} from '../services/group.service.js';
import db from '../database/db.js';

export const listGroups = async (_req: Request, res: Response): Promise<any> => {
  try {
    const groups = await getAllGroups();
    return res.json({ status: 'success', groups });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

export const getGroup = async (req: Request, res: Response): Promise<any> => {
  try {
    const groupId = Number(req.params.id);
    if (isNaN(groupId)) {
      return res.status(400).json({ status: 'error', message: 'Invalid group ID' });
    }

    const group = await getGroupById(groupId);
    if (!group) {
      return res.status(404).json({ status: 'error', message: 'Group not found' });
    }

    return res.json({ status: 'success', group });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

export const createNewGroup = async (req: Request, res: Response): Promise<any> => {
  try {
    const { name } = req.body;

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ status: 'error', message: 'Group name is required and must be a string.' });
    }

    const group = await createGroup(name);
    return res.status(201).json({ status: 'success', group });
  } catch (error: any) {
    const isUniqueViolation = error?.code === 'SQLITE_CONSTRAINT' || error?.code === '23505';
    const message = isUniqueViolation
      ? 'Group name already exists.'
      : error.message;

    return res.status(400).json({ status: 'error', message });
  }
};

export const updateGroupById = async (req: Request, res: Response): Promise<any> => {
  try {
    const groupId = Number(req.params.id);
    const { name } = req.body;

    if (isNaN(groupId)) {
      return res.status(400).json({ status: 'error', message: 'Invalid group ID' });
    }

    if (!name || typeof name !== 'string') {
      return res.status(400).json({ status: 'error', message: 'Group name is required and must be a string.' });
    }

    const updated = await updateGroup(groupId, name);
    if (!updated) {
      return res.status(404).json({ status: 'error', message: 'Group not found' });
    }

    return res.json({ status: 'success', group: updated });
  } catch (error: any) {
    const isUniqueViolation = error?.code === 'SQLITE_CONSTRAINT' || error?.code === '23505';
    const message = isUniqueViolation
      ? 'Group name already exists.'
      : error.message;

    return res.status(400).json({ status: 'error', message });
  }
};

export const removeGroup = async (req: Request, res: Response): Promise<any> => {
  try {
    const groupId = Number(req.params.id);
    if (isNaN(groupId)) {
      return res.status(400).json({ status: 'error', message: 'Invalid group ID' });
    }

    const deleted = await deleteGroup(groupId);
    if (!deleted) {
      return res.status(404).json({ status: 'error', message: 'Group not found' });
    }

    return res.json({ status: 'success', message: 'Group deleted' });
  } catch (error: any) {
    return res.status(500).json({ status: 'error', message: error.message });
  }
};

export const addUsersToGroup = async (req: Request, res: Response): Promise<any> => {
    try {
      const groupId = Number(req.params.groupId);
      const { userIds } = req.body;
  
      // Validate groupId
      if (isNaN(groupId)) {
        return res.status(400).json({ status: 'error', message: 'Invalid group ID' });
      }
  
      // Validate userIds
      if (!Array.isArray(userIds) || userIds.length === 0) {
        return res.status(400).json({
          status: 'error',
          message: 'userIds must be a non-empty array',
        });
      }
  
      const allNumbers = userIds.every((id) => typeof id === 'number');
      if (!allNumbers) {
        return res.status(400).json({
          status: 'error',
          message: 'All userIds must be numbers',
        });
      }
  
      // Check if group exists
      const group = await getGroupById(groupId);
      if (!group) {
        return res.status(404).json({
          status: 'error',
          message: `Group with ID ${groupId} does not exist.`,
        });
      }
  
      // Check if all users exist
      const existingUsers = await db('users')
        .whereIn('id', userIds)
        .select('id');
  
      const existingIds = existingUsers.map((u) => u.id);
      const missingUserIds = userIds.filter((id) => !existingIds.includes(id));
  
      if (missingUserIds.length > 0) {
        return res.status(404).json({
          status: 'error',
          message: `User(s) not found: [${missingUserIds.join(', ')}]`,
        });
      }
  
      // Safe to assign
      await assignUsersToGroup(groupId, userIds);
  
      return res.json({
        status: 'success',
        message: 'Users assigned to group successfully',
      });
    } catch (error: any) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to assign users to group',
        error: error.message,
      });
    }
  };


  export const removeUserFromGroup = async (req: Request, res: Response): Promise<any> => {
    try {
      const groupId = Number(req.params.groupId);
      const userId = Number(req.params.userId);
  
      if (isNaN(groupId) || isNaN(userId)) {
        return res.status(400).json({ status: 'error', message: 'Invalid group or user ID' });
      }
  
      const exists = await db('users_groups')
        .where({ group_id: groupId, user_id: userId })
        .first();
  
      if (!exists) {
        return res.status(404).json({
          status: 'error',
          message: `User ${userId} is not in group ${groupId}`,
        });
      }
  
      await db('users_groups')
        .where({ group_id: groupId, user_id: userId })
        .delete();
  
      return res.json({
        status: 'success',
        message: `User ${userId} removed from group ${groupId}`,
      });
    } catch (error: any) {
      return res.status(500).json({
        status: 'error',
        message: 'Failed to remove user from group',
        error: error.message,
      });
    }
  };
  
