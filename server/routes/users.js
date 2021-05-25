// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      reply.render('users/list', { users });
      return reply;
    })
    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/edit', { user });
    })
    .post('/users', async (req, reply) => {
      try {
        const user = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(user);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/edit', { user: req.body.data, errors: data });
        return reply;
      }
    });
    app.patch('/users/:id', { name: 'updateUser' }, async (request, reply) => {
      const userId = request.session.get('userId');
      if (parseInt(request.params.id, 10) !== userId) {
        request.flash('error', i18next.t('views.pages.users.edit.noAllowed'));
        reply.redirect(app.reverse('users'));
      }
  
      try {
        const user = await app.objection.models.user
          .query()
          .findById(request.currentUser.id);
        await user.$query().update(request.body.user);
        request.flash('success', 'User updated successfuly');
        reply.redirect(app.reverse('editUser', { id: request.params.id }));
      } catch (e) {
        request.flash('error', 'Invalid data');
        reply.redirect(app.reverse('editUser', { id: request.params.id }));
      }
    });
};