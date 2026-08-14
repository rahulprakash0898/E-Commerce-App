const mongoose = require("mongoose");

const WishlistSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    items: [
      {
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
          required: true,
        },
        title: String,
        image: String,
        price: Number,
        salePrice: Number,
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Wishlist", WishlistSchema);
