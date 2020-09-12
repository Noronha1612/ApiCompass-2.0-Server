import Knex from 'knex';

export async function up(knex: Knex) {
    return knex.schema.createTable('users', table => {
        table.string('id').notNullable();
        table.string('name').notNullable();
        table.string('email').notNullable();
        table.string('password').notNullable();
        table.string('created_api_ids').notNullable();
        table.string('liked_api_ids').notNullable();
        table.string('followers').notNullable();
        table.string('following').notNullable();
        table.integer('score').notNullable();
    });
}

export async function down(knex: Knex) {
    return knex.schema.dropTable('users');
}