const mongodb = require("mongodb");
const getDb = require("../util/database").getDb;

class User {
  constructor(username, email, cart, _id) {
    this.name = username;
    this.email = email;
    this.cart = cart; // {items: []}
    this._id = _id;
  }

  // We can use then and catch or just return it
  // Lets whoever calls it listen for that if there is a need for that
  save() {
    const db = getDb();
    return db.collection("users").insertOne(this);
  }

  addToCart(product) {
    const cartProductIndex = this.cart.items.findIndex(cp => {
      // Two equals because _id is not actually an string
      return cp.productId == product._id;
    });
    let newQuantity = 1;
    const updatedCardItems = [...this.cart.items];
    // Inserting the new updated quantity
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

  getCart() {
    const db = getDb();
    const productIds = this.cart.items.map(i => {
      return i.productId;
    });
    // Becasue I already have all User and Cart data in this model
    return db
      .collection("products")
      .find({ _id: { $in: productIds } })
      .toArray()
      .then(products => {
        return products.map(p => {
          // Return an object for every product, every product is an object
          return {
            ...p,
            quantity: this.cart.items.find(i => {
              return i.productId.toString() === p._id.toString();
            }).quantity
          };
        });
      });
  }

  deleteCardItem(productId) {
    const updatedCartItems = this.cart.items.filter(item => {
      return item.productId.toString() !== productId.toString();
    });
    const db = getDb();
    return db
      .collection("users")
      .updateOne(
        { _id: new mongodb.ObjectID(this._id) },
        { $set: { cart: { items: updatedCartItems } } }
      );
    // This will update the cart to have all items except the ones we delete it
  }

  addOrder() {
    const db = getDb();
    return this.getCart()
      .then(products => {
        const order = {
          items: products,
          user: {
            _id: new mongodb.ObjectID(this._id),
            name: this.name
          }
        };
        return db.collection("orders").insertOne(order);
      })
      .then(result => {
        this.cart = { items: [] };
        return db
          .collection("users")
          .updateOne(
            { _id: new mongodb.ObjectID(this._id) },
            { $set: { cart: { items: updatedCartItems } } }
          );
      });
  }

  getOrders() {
    const db = getDb();
    return db
      .collection("orders")
      .find({ "user._id": new mongodb.ObjectID(this._id) })
      .toArray();
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
