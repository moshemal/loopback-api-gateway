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
    console.log(userData);
    if (userData.role.includes('root') || userData.organizationId == organizationId) {
      next();
    } else {
      next(forbiddenAccess());
    }
  });
}

module.exports = {
  forbiddenAccess,
  belongsToOrganization,
};
