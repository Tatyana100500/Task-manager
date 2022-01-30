// @ts-check

exports.up = (knex) => (
    knex.schema.createTable('tasks', (table) => {
      table.increments('id').primary();
      table.integer('creatorId');
	  table.integer('executorId');
      table.string('name');
      table.string('description');
      table.integer('performerId');
      table.integer('statusId');
      table.varchar('labels');
	  table.timestamp('updated_at').defaultTo(knex.fn.now());
    })
  );
  
  exports.down = (knex) => knex.schema.dropTable('tasks');