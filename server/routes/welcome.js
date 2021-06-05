// @ts-check

export default (app) => {
  app.get('/', { name: 'root' }, (req, reply) => {
    console.log(reply);
    reply.render('welcome/index');
  })
  .get('/protected', { name: 'protected', preValidation: app.authenticate }, (req, reply) => {
    reply.render('welcome/index');
  });
};