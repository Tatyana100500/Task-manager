// @ts-check

import encrypt from '../lib/secure';
import i18next from 'i18next';
// @ts-ignore
import buildFromObj from '../lib/formObjectBuilder';
import debug from 'debug';
const log = debug('??????????????????????????');

export default (app) => {
  app
  .get('/session/new', { name: 'newSession' }, (req, reply) => {
      const signInForm = {};
      reply.render('session/new', { signInForm });
    })
  .post('/session', { name: 'session' }, app.fp.authenticate('form', async (req, reply, err, user) => {
    console.log(reply, err, user);
      if (err) {
        return app.httpErrors.internalServerError(err);
      }
      if (!user) {
        const signInForm = req.body.data;
        const errors = {
          email: [{ message: i18next.t('flash.session.create.error') }],
        };

        app.log.info(errors);
        return reply.render('/session', { signInForm, errors } );
      }
      await req.logIn(user);
      req.flash('success', 'Вы залогинены');
      return reply.redirect(app.reverse('root'));
    }))
  .delete('/session', (req, reply) => {
      req.logOut();
      req.flash('info', i18next.t('flash.session.delete.success'));
      reply.redirect(app.reverse('root'));
    });
};