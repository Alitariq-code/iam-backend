import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('permissions', (table) => {
    table.increments('id').primary();
    table
      .enu('action', ['create', 'read', 'update', 'delete'])
      .notNullable();
    table
      .integer('module_id')
      .unsigned()
      .references('id')
      .inTable('modules')
      .onDelete('CASCADE')
      .notNullable();
    table.unique(['action', 'module_id']);
    table.timestamps(true, true);
  });
}

export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTableIfExists('permissions');
}
