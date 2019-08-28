const {belongsToOrganization} = require('../permission');

module.exports = function(Example) {
  Example.beforeRemote('*', function(ctx, bla, next) {
    console.log(ctx.args, bla);
    belongsToOrganization(Example,
      ctx.req.accessToken.userId, ctx.args.organizationId, next);
    // for error call next with new Error('reason of error')
  });

  Example.foo = function(organizationId, next) {
    // res.send('[\n');
    // res.send('"lala"\n');
    // res.send(']');
    next(null, {result: 'from foo'});
  };

  Example.remoteMethod(
    'foo', {
      description: 'example of api method',
      http: {
        path: '/foo',
        verb: 'get',
      },
      accepts: [
        {arg: 'organizationId', type: 'number', required: true, 'http': {source: 'query'}},
      ],
      returns: {
        type: 'object',
        root: true,
      },
    }
  );
};
