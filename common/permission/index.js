function forbiddenAccess() {
  const error = new Error();
  Object.assign(error, {
    status: 403,
    message: 'access is forbidden :(',
  });
  return error;
}

function belongsToOrganization(Model, userId, organizationId, next) {
  const AppUser = Model.registry.getModel('AppUser');
  return AppUser.findById(userId).then(user => {
    const userData = JSON.parse(JSON.stringify(user));
    if (userData.organizationId == organizationId) {
      next();
    } else {
      next(forbiddenAccess());
    }
  });
}

function belongsToOrgOrRoot(Model, accessToken, organizationId, next) {
  if (accessToken.roles.some(r => r.name === 'root')) {
    return next();
  } else {
    belongsToOrganization(Model, accessToken.userId, organizationId, next);
  }
}

module.exports = {
  forbiddenAccess,
  belongsToOrgOrRoot,
};
