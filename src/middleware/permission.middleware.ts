import { Request, Response, NextFunction } from 'express';
import { getUserPermissions } from '../services/permission.service.js';

export const checkPermission = (
  module: string,
  action: 'create' | 'read' | 'update' | 'delete'
) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      const userId = (req as any).user?.id;

      if (!userId) {
        res.status(401).json({
          status: 'error',
          message: 'Unauthorized: missing user context',
        });
        return;
      }

      const permissions = await getUserPermissions(userId);

      const allowed = permissions.some(
        (perm: any) =>
          perm.module.toLowerCase() === module.toLowerCase() &&
          perm.action.toLowerCase() === action.toLowerCase()
      );

      if (!allowed) {
        res.status(403).json({
          status: 'error',
          message: `Forbidden: you do not have permission to ${action} ${module}`,
        });
        return;
      }

      next();
    } catch (err: any) {
      console.error(`❌ Permission check failed: ${err.message}`);
      res.status(500).json({
        status: 'error',
        message: 'Internal server error during permission check',
      });
    }
  };
};
