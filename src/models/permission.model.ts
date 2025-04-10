export interface Permission {
    id: number;
    action: 'create' | 'read' | 'update' | 'delete';
    module_id: number;
    created_at?: Date;
    updated_at?: Date;
  }
  