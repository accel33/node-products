const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class User {
  constructor(username, email) {
    this.username = username;
    this.email = email;
  }

  save() {
    const db = getDb();
    // We can use then and catch or just return it
    // Lets whoever calls it listen for that if there is a need for that
    return db.collection("users").insertOne(this);
  }

  static findUser(userId) {
    const db = getDb();
    return db
      .collection("users")
      .findOne({ _id: mongodb.ObjectID(userId) })
      .then(user => {
        console.log("Inside user.js, after then");
        console.log(user);

        return user;
      })
      .catch(err => console.log(err));
  }
}

module.exports = User;
