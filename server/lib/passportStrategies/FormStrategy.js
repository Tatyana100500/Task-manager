// @ts-check

import _ from 'lodash';
import { Strategy } from 'fastify-passport';

export default class FormStrategy extends Strategy {
  constructor(name, app) {
    super(name);
    this.app = app;
  }

  async authenticate(request) {
    if (request.isAuthenticated()) {
      return this.pass();
    }

    const email = _.get(request, 'body.data.Email', null);
    const password = _.get(request, 'body.data.Пароль', null);
    const { models } = this.app.objection;
    const user = await models.user.query().findOne({ email });
    console.log(user);
    if (user && user.verifyPassword(password)) {
      return this.success(user);
    }

    return this.fail();
  }
}