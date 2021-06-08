// @ts-check

import i18next from 'i18next';

export default (app) => {
  app
    .get('/users', { name: 'users' }, async (req, reply) => {
      const users = await app.objection.models.user.query();
      console.log(users);
      reply.render('users/index', { users });
      return reply;
    })
    .get('/users/new', { name: 'newUser' }, (req, reply) => {
      const user = new app.objection.models.user();
      reply.render('users/new', { user });
    })
    .post('/users', { name: 'addUser' }, async (req, reply) => {
      try {
        const user = await app.objection.models.user.fromJson(req.body.data);
        await app.objection.models.user.query().insert(user);
        req.flash('info', i18next.t('flash.users.create.success'));
        reply.redirect(app.reverse('root'));
        debugger;
        return reply;
      } catch ({ data }) {
        req.flash('error', i18next.t('flash.users.create.error'));
        reply.render('users/new', { user: req.body.data, errors: data });
        return reply;
      }
    });
    app.delete('/users/:id', { name: 'deleteUser', preHandler: app.auth([app.authCheck]) }, async (request, reply) => {
      const userId = request.session.get('userId');
      if (parseInt(request.params.id, 10) !== userId) {
        request.flash('error', i18next.t('views.pages.users.delete.error.notAllowed'));
        reply.redirect(app.reverse('users'));
      }
      try {
        const assignedTasks = await app.objection.models.user.relatedQuery('assignedTasks').for(request.params.id);
        const createdTasks = await app.objection.models.user.relatedQuery('createdTasks').for(request.params.id);
        if (createdTasks.length > 0 || assignedTasks.length > 0) {
          request.flash('error', i18next.t('views.pages.users.delete.error.hasTasks'));
        } else {
          await app.objection.models.user.query().deleteById(request.params.id);
          request.flash('success', i18next.t('views.pages.users.delete.success'));
          request.session.delete();
          reply.redirect(app.reverse('root'));
        }
      } catch (e) {
        request.flash('error', i18next.t('views.pages.users.delete.error.deleteError'));
      }
      reply.redirect(app.reverse('users'));
    });
  
    app.patch('/users/:id', { name: 'updateUser', preHandler: app.auth([app.authCheck]) }, async (request, reply) => {
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