'use strict';

module.exports = function(AppUser) {
  AppUser.afterRemote('login', (ctx, modelInstance, next) => {
    AppUser.app.models.RoleMapping.find({
      where: {
        principalType: 'USER',
        principalId: modelInstance.userId.toString(),
      },
      include: 'role',
    }).then(roleMappings => {
      const roles = roleMappings.map(item => {
        const role = item.role();
        return {
          id: role.id,
          name: role.name,
        };
      });
      modelInstance.roles = roles;
      modelInstance.save();
      next();
    });
  });
};
