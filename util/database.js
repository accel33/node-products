const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;

// The _ indicates that this is going to be use internally on this file
let _db;

const mongoConnect = callback => {
  MongoClient.connect(
    "mongodb+srv://accel:1234@project0-lkznl.mongodb.net/shop?retryWrites=true&w=majority"
  )
    .then(client => {
      console.log("Connected");
      _db = client.db();
      callback();
    })
    .catch(err => {
      console.log(err);
      throw err;
    });
};

// This is so that we dont have to use the promise everytime we call DB
const getDb = () => {
  if (_db) {
    return _db;
  } else {
    throw "No database found";
  }
};

// module.exports = mongoConnect;
exports.mongoConnect = mongoConnect;
exports.getDb = getDb;
