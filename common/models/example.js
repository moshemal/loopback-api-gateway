const {belongsToOrgOrRoot} = require('../permission');

module.exports = function(Example) {
  Example.beforeRemote('*', function(ctx, bla, next) {
    console.log(ctx.args, bla, ctx.req.accessToken);
    belongsToOrgOrRoot(Example, ctx.req.accessToken, ctx.args.organizationId, next);
  });

  Example.foo = function(organizationId, next) {
    next(null, {result: 'from foo ' + organizationId});
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
