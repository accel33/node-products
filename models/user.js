const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const userSchema = new Schema({
  email: {
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  resetToken: String,
  resetTokenExpiration: Date,
  cart: {
    items: [
      {
        productId: {
          type: Schema.Types.ObjectId,
          ref: "Product",
          require: true
        },
        quantity: {
          type: Number,
          require: true
        }
      }
    ]
  }
});

userSchema.methods.addToCart = function(product) {
  const cartProductIndex = this.cart.items.findIndex(cp => {
    return cp.productId.toString() === product._id.toString();
  });
  let newQuantity = 1;
  const updatedCardItems = [...this.cart.items];
  if (cartProductIndex >= 0) {
    newQuantity = this.cart.items[cartProductIndex].quantity + 1;
    updatedCardItems[cartProductIndex].quantity = newQuantity;
  } else {
    updatedCardItems.push({
      productId: product._id,
      quantity: newQuantity
    });
  }
  const updatedCart = {
    items: updatedCardItems
  };
  this.cart = updatedCart;
  return this.save();
};

userSchema.methods.removeCartItems = function(productId) {
  const updatedCartItems = this.cart.items.filter(item => {
    return item.productId.toString() !== productId.toString();
  });
  this.cart.items = updatedCartItems;
  return this.save();
};

userSchema.methods.clearCart = function() {
  this.cart = { items: [] };
  return this.save();
};

userSchema.methods.getCart = function() {
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
};

module.exports = mongoose.model("User", userSchema);
