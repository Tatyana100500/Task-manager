// @ts-check

import encrypt from '../lib/secure';
import i18next from 'i18next';
import debug from 'debug';
const log = debug('??????????????????????????');

export default (app) => {
  app
  .get('/session/new', { name: 'newSession' }, (req, reply) => {
      const signInForm = {};
      reply.render('session/new', { signInForm });
    })
  .post('/session', { name: 'session' }, app.fp.authenticate('form', async (req, reply, err, user) => {
      if (err) {
        return app.httpErrors.internalServerError(err);
      }
      if (!user) {
        const signInForm = req.body.data;
        console.log("user end data", signInForm, user)
        const errors = {
          email: [{ message: i18next.t('flash.session.create.error') }],
        };
        return reply.render('session/new', { signInForm, errors });
      }
      const ass = await req.logIn(user);
      console.log(ass);
      req.flash('success', 'Вы залогинены');
      return reply.redirect(app.reverse('root'));
    }))
  .delete('/session', (req, reply) => {
      req.logOut();
      req.flash('info', i18next.t('flash.session.delete.success'));
      reply.redirect(app.reverse('root'));
    });
};