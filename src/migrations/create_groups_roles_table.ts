// migration: create_groups_roles_table.ts
import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('groups_roles', (table) => {
    table.increments('id').primary();
    table.integer('group_id').unsigned().notNullable()
      .references('id').inTable('groups').onDelete('CASCADE');
    table.integer('role_id').unsigned().notNullable()
      .references('id').inTable('roles').onDelete('CASCADE');
    table.unique(['group_id', 'role_id']);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('groups_roles');
}
