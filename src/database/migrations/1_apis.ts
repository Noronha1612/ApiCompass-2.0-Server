import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('apis', table => {
        table.increments('id').primary();
        table.string('apiName').notNullable();
        table.string('description').notNullable();
        table.string('mainUrl').notNullable();
        table.string('documentationUrl');
        table.string('creator_id').notNullable();
        table.decimal('views').notNullable();
        table.decimal('likes').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('apis');
}