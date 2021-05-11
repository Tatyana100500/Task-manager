// @ts-check

import welcome from './welcome.js';
import users from './users.js';
import session from './session.js';
import status from './status';
import tasks from './tasks';
import labels from './labels';

const controllers = [
  welcome,
  users,
  session,
  status,
  tasks,
  labels,
];

export default (app) => controllers.forEach((f) => f(app));