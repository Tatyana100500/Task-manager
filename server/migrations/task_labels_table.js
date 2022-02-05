// @ts-check

exports.up = (knex) => (
  knex.schema.createTable('task_labels', (table) => {
    table.increments('id').primary();
    table.integer('labelId');
    table.integer('taskId');
  })
);
exports.down = (knex) => knex.schema.dropTable('task_labels');
