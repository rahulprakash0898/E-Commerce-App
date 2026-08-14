const express = require("express");
const {
  addToWishlist,
  getWishlistItems,
  removeFromWishlist,
} = require("../../controllers/shop/wishlist-controller");

const router = express.Router();

router.post("/add", addToWishlist);
router.get("/get/:userId", getWishlistItems);
router.delete("/delete/:userId/:productId", removeFromWishlist);

module.exports = router;