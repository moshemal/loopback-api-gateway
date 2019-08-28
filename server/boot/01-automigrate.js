const createInitialData = require('./sub-scripts/create-initial-data');

const automigrate = process.env.AUTOMIGRATE;
module.exports = function(app) {
  switch (automigrate) {
    case 'reset':
      app.datasources.db.automigrate()
        .then(function() {
          createInitialData(app);
        });
      break;
    case 'update':
      app.datasources.db.autoupdate();
      break;
    default:
      break;
  }
};
