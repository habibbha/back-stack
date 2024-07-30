const Product = require('../models/product.model');
const Carta = require('../models/carta.model');
const mongoose = require('mongoose');

exports.addToCarta = async (req, res) => {
  const { cartId } = req.params;
  const { productId, quantity, userId } = req.body;

  if (!mongoose.Types.ObjectId.isValid(productId)) {
    return res.status(400).json({ message: "Invalid product ID format." });
  }

  try {
    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    let cart = await Carta.findOne({ cartId: cartId });
    if (!cart) {
      cart = new Carta({
        cartId: cartId,
        items: [{ product: productId, quantity, price: product.price }],
        userId: userId 
      });
    } else {
      const itemIndex = cart.items.findIndex(item => item.product.toString() === productId);
      if (itemIndex > -1) {
        cart.items[itemIndex].quantity += quantity;
      } else {
        cart.items.push({ product: productId, quantity, price: product.price });
      }
    }

    cart.total = cart.items.reduce((total, item) => {
      const price = parseFloat(item.price.replace(/,/g, ''));
      return total + (price * item.quantity);
    }, 0);

    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error in addToCarta:", error);
    res.status(500).json({ message: "Error adding to cart", error: error.message });
  }
};

exports.getCarta = async (req, res) => {
  const { cartId } = req.params;
  try {
    const cart = await Carta.findOne({ cartId: cartId }).populate('items.product');
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(cart);
  } catch (error) {
    res.status(500).json({ message: "Error fetching cart", error: error.message });
  }
};

exports.updateCartWithUserInfo = async (req, res) => {
  const { cartId } = req.params;
  const { userInfo } = req.body;
  const userId = req.userId; // Récupérer l'ID de l'utilisateur connecté

  try {
    const updatedCart = await Carta.findOneAndUpdate(
      { cartId: cartId, userId: userId }, // Filtrer par cartId et userId
      { userInfo: userInfo },
      { new: true, runValidators: true }
    ).populate('items.product');

    if (!updatedCart) {
      return res.status(404).json({ message: "Cart not found" });
    }
    res.status(200).json(updatedCart);
  } catch (error) {
    console.error("Error in updateCartWithUserInfo:", error);
    res.status(500).json({ message: "Error updating cart with user info", error: error.message });
  }
};

exports.updateItemQuantity = async (req, res) => {
  const { cartId, itemId } = req.params;
  const { quantity } = req.body;

  if (typeof quantity !== 'number' || quantity < 1) {
    return res.status(400).json({ message: "Invalid quantity. Must be a positive number." });
  }

  try {
    const cart = await Carta.findOne({ cartId });
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" });
    }

    const itemIndex = cart.items.findIndex(item => item._id.toString() === itemId);

    if (itemIndex === -1) {
      return res.status(404).json({ message: "Item not found in cart" });
    }

    cart.items[itemIndex].quantity = quantity;
    await cart.save();
    res.status(200).json(cart);
  } catch (error) {
    console.error("Error updating item quantity:", error);
    res.status(500).json({ message: "Error updating item quantity", error: error.message });
  }
};

exports.removeItemFromCart = async (req, res) => {
  const { cartId, itemId } = req.params; 

  try {
    const cart = await Carta.findById(cartId); 
    if (!cart) {
      return res.status(404).json({ message: "Cart not found" }); 
    }

    cart.items = cart.items.filter(item => item._id.toString() !== itemId);
    await cart.save(); 
    res.status(200).json(cart); 
  } catch (error) {
    console.error("Error in removeItemFromCart:", error);
    res.status(500).json({ message: "Error removing item from cart", error: error.message }); 
  }
};

exports.getAllCarts = async (req, res) => {
  try {
    const carts = await Carta.find().populate('items.product');
    if (!carts.length) {
      return res.status(404).json({ message: "No carts found" });
    }
    res.status(200).json(carts);
  } catch (error) {
    console.error("Error in getAllCarts:", error);
    res.status(500).json({ message: "Error fetching carts", error: error.message });
  }
};

exports.getCartsByUserId = async (req, res) => {
  const { userId } = req.params; 
  try {
    const carts = await Carta.find({ userId }).populate('items.product');
    if (!carts.length) {
      return res.status(404).json({ message: "No carts found for this user" });
    }
    res.status(200).json(carts);
  } catch (error) {
    console.error("Error in getCartsByUserId:", error);
    res.status(500).json({ message: "Error fetching carts by user ID", error: error.message });
  }
};
