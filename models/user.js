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
    const cartProductIndex = this.cart.items.findIndex(cp => {
      // Two equals because _id is not actually an string
      return cp.productId == product._id;
    });
    let newQuantity = 1;
    const updatedCardItems = [...this.cart.items];
    if (cartProductIndex >= 0) {
      newQuantity = this.cart.item[cartProductIndex].quantity + 1;
      updatedCardItems[cartProductIndex].quantity = newQuantity;
    } else {
      // If item dont exist before then I create one
      updatedCardItems.push({
        productId: new mongodb.ObjectID(product._id),
        quantity: newQuantity
      });
    }
    const updatedCart = {
      items: updatedCardItems
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
