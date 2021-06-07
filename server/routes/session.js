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
/*
  .post('/session', { name: 'session' }, app.fp.authenticate('form', async (req, reply, err, user) => {
    console.log(user, err, req.body);
      if (err) {
        console.log("http error", app.reverse('root'), app.reverse('session'));
        return app.httpErrors.internalServerError(err);
      }
      if (!user) {
        const signInForm = req.body.data;
        console.log("user false", encrypt(req.body.data.password), user.passwordDigest)
        const errors = {
          email: [{ message: i18next.t('flash.session.create.error') }],
        };
        return reply.render('session/new', { signInForm, errors });
      }
      const ass = await req.logIn(user);
      console.log('success', ass);
      req.flash('success', 'Вы залогинены');
      return reply.redirect(app.reverse('root'));
    }))*/
    .post('/session', { name: 'session' }, async (request, reply) => {
      try {
        const [user] = await app.objection.models.user
          .query()
          .select()
          .where({
            email: request.body.email,
          });
        const password = encrypt(request.body.password);
        console.log(user, password);
        if (!user || password !== user.passwordDigest) {
          request.flash('error', 'Bad username or password');
          reply.redirect(app.reverse('session'));
        }
        if (password === user.passwordDigest) {
          request.session.set('userId', user.id);
          request.flash('success', 'Вы залогинены');
          reply.redirect(app.reverse('root'));
        }
      } catch (e) {
        console.log('error !!!', e)
        request.flash('error', 'Login error!');
        reply.redirect(app.reverse('session'));
      }
    })
  .delete('/session', (req, reply) => {
      req.logOut();
      req.flash('info', i18next.t('flash.session.delete.success'));
      reply.redirect(app.reverse('root'));
    });
};