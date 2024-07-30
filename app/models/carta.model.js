
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const cartItemSchema = new Schema({
  product: {
    type: Schema.Types.ObjectId,
    ref: 'Product',
    required: true
  },
  quantity: {
    type: Number,
    required: true,
    min: 1,
    default: 1
  },
  price: { type: String, required: true } ,
});

const userInfoSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  address:{type:String,rquired:true},
  city: { type: String, required: true },
  country:{type:String,rquired:true},
  postalCode: { type: String, required: true },
  phoneNumber: { type: String, required: true },
});

const cartSchema = new Schema({
  cartId: {
    type: String,
    required: true,
    unique: true
  },
  items: [cartItemSchema],
  total: {
    type: String,
    required: true,
    default: 0
  },
  userInfo: userInfoSchema ,
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  }
});

module.exports = mongoose.model('Carta', cartSchema);
