const Wishlist = require("../../models/Wishlist");
const Product = require("../../models/Product");

const addToWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.body;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const product = await Product.findById(productId);
    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found!",
      });
    }

    let wishlist = await Wishlist.findOne({ userId });

    if (!wishlist) {
      wishlist = new Wishlist({ userId, items: [] });
    }

    const findCurrentProductIndex = wishlist.items.findIndex(
      (item) => item.productId.toString() === productId
    );

    if (findCurrentProductIndex === -1) {
      wishlist.items.push({
        productId: product._id,
        title: product.title,
        image: product.image,
        price: product.price,
        salePrice: product.salePrice,
      });
    } else {
      // Remove if already in wishlist (toggle behavior)
      wishlist.items.splice(findCurrentProductIndex, 1);
    }

    await wishlist.save();
    res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error updating wishlist",
    });
  }
};

const getWishlistItems = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "User id is mandatory!",
      });
    }

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(200).json({
        success: true,
        data: { items: [] },
      });
    }

    res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching wishlist",
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const { userId, productId } = req.params;

    if (!userId || !productId) {
      return res.status(400).json({
        success: false,
        message: "Invalid data provided!",
      });
    }

    const wishlist = await Wishlist.findOne({ userId });
    if (!wishlist) {
      return res.status(404).json({
        success: false,
        message: "Wishlist not found!",
      });
    }

    wishlist.items = wishlist.items.filter(
      (item) => item.productId.toString() !== productId
    );

    await wishlist.save();

    res.status(200).json({
      success: true,
      data: wishlist,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error removing from wishlist",
    });
  }
};

module.exports = {
  addToWishlist,
  getWishlistItems,
  removeFromWishlist,
};
