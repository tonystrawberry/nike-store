const MongoClient = require('mongodb').MongoClient;
let db;

module.exports = {
  connectToServer: function( callback ) {
    MongoClient.connect(process.env.DATABASE_URL,  { useUnifiedTopology: true, useNewUrlParser: true }, function( err, client ) {
      db = client.db(process.env.DATABASE_NAME);
      console.log(`Connected MongoDB: ${process.env.DATABASE_URL}`);
      console.log(`Database: ${process.env.DATABASE_NAME}`);
      return callback( err );
    });
  },

  getDb: function() {
    return db;
  }
};
