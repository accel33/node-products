const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class User {
  constructor(username, email, cart, _id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // {items: []}
    this._id = _id;
  }

  save() {
    const db = getDb();
    // We can use then and catch or just return it
    // Lets whoever calls it listen for that if there is a need for that
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    // const cartProduct = this.cart.item.findIndex(cp => {
    //   return cp._id === product._id;
    // });
    const updatedCart = {
      items: [{ productId: new mongodb.ObjectID(product._id), quantity: 1 }]
    };
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectID(this._id) },
        { $set: { cart: updatedCart } }
      );
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
