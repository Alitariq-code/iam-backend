import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('roles_permissions', (table) => {
    table.increments('id').primary();
    table
      .integer('role_id')
      .unsigned()
      .references('id')
      .inTable('roles')
      .onDelete('CASCADE')
      .notNullable();
    table
      .integer('permission_id')
      .unsigned()
      .references('id')
      .inTable('permissions')
      .onDelete('CASCADE')
      .notNullable();
    table.unique(['role_id', 'permission_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('roles_permissions');
}
