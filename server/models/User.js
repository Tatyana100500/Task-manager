// @ts-check

import { Model } from 'objection';
import objectionUnique from 'objection-unique';
import path from 'path';
//import encrypt from '../lib/secure.js';
import objectionPassword from 'objection-password';
//const Statuses = require('./Status');
const unique = objectionUnique({ fields: ['email'] });
const password = objectionPassword();

export default class User extends unique(password(Model)) {
  static get tableName() {
    return 'users';
  }

  getFullName() {
    return `${this.firstName} ${this.lastName}`;
  }

  async $beforeUpdate() {
    this.updatedAt = new Date().toLocaleString();
  }

  static get jsonSchema() {
    return {
      type: 'object',
      required: ['firstName', 'lastName', 'email', 'password'],
      properties: {
        firstName: { type: 'string', minLength: 1, maxLength: 255 },
        lastName: { type: 'string', minLength: 1, maxLength: 255 },
        email: { type: 'string', minLength: 1, maxLength: 255 },
        password: { type: 'string', minLength: 7, maxLength: 255 },
        createdAt: { type: 'string' },
        updatedAt: { type: 'string' },
      },
    };
  }

  static get relationMappings() {
	console.log(path.join(__dirname, 'status'));
    return {
      status: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'Status'),
        join: {
          from: 'users.id',
          to: 'statuses.creator_id',
        },
      },
      task: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'task'),
        join: {
          from: 'users.id',
          to: 'tasks.creator_id',
        },
      },
      task_executor: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'task'),
        join: {
          from: 'users.id',
          to: 'tasks.executor_id',
        },
      },
      label: {
        relation: Model.HasManyRelation,
        modelClass: path.join(__dirname, 'label'),
        join: {
          from: 'users.id',
          to: 'labels.creator_id',
        },
      },
    };
  }
}