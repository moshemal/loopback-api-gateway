'use strict';

module.exports = async function(app) {
  await Promise.all([
    // create roles
    app.models.Role.create(rolesData),
    // create a root user
    app.models.AppUser.create(usersData),
  ]).then(([roles, users]) => {
    for (let i = 0; i < users.length; i++) {
      let user = users[i];
      let role = roles[i];
      role.principals.create({
        principalType: 'USER',
        principalId: user.id,
      });
      user.save();
    }
    console.log(users);
    return {roles, users};
  });
  return addAcls(app);
};

const rolesData = ['root', 'org-admin'].map(name => ({name}));

const usersData = [
  {
    email: 'root@bla.com',
    password: 'Aa1234567890',
  },
  {
    email: 'org-admin@bla.com',
    password: 'Aa1234567890',
  },
];

function addAcls(app) {
  return Promise.all([
    app.models.ACL.create({
      model: '*',
      property: '*',
      accessType: '*',
      principalType: 'ROLE',
      principalId: '$everyone',
      permission: 'DENY',
    }),
    app.models.ACL.create({
      model: '*',
      property: '*',
      accessType: '*',
      principalType: 'ROLE',
      principalId: 'root',
      permission: 'ALLOW',
    }),
    ...[].map(modelName => app.models.ACL.create({
      model: modelName,
      property: '*',
      accessType: '*',
      principalType: 'ROLE',
      principalId: '$authenticated',
      permission: 'ALLOW',
    })),
  ]);
}