const express = require("express");

const { PORT } = require("./helpers");
const { connectDB } = require("./helpers/db");

const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRouter = require("./routes/auth/auth-routes");
const adminProductsRouter = require("./routes/admin/products-routes");
const adminOrderRouter = require("./routes/admin/order-routes");

const shopProductsRouter = require("./routes/shop/products-routes");
const shopCartRouter = require("./routes/shop/cart-routes");
const shopAddressRouter = require("./routes/shop/address-routes");
const shopOrderRouter = require("./routes/shop/order-routes");
const shopSearchRouter = require("./routes/shop/search-routes");
const shopReviewRouter = require("./routes/shop/review-routes");
const shopWishlistRouter = require("./routes/shop/wishlist-routes");

const commonFeatureRouter = require("./routes/common/feature-routes");

//create a database connection -> u can also
//create a separate file for this and then import/use that file here

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:5174",
  process.env.CLIENT_BASE_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin) || process.env.NODE_ENV !== "production") {
        callback(null, true);
      } else {
        callback(null, true); // Allow cross-origin requests for deployment flexibility
      }
    },
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: [
      "Content-Type",
      "Authorization",
      "Cache-Control",
      "Expires",
      "Pragma",
    ],
    credentials: true,
  })
);

app.use(cookieParser());
app.use(express.json());

// Ensure Database is connected before executing any route handlers
app.use(async (req, res, next) => {
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection error:", error);
    return res.status(500).json({
      success: false,
      message: `Database Connection Failed: ${error.message}`,
    });
  }
});

app.use("/api/v1/auths", authRouter);
app.use("/api/v1/admins/products", adminProductsRouter);
app.use("/api/v1/admins/orders", adminOrderRouter);

app.use("/api/v1/shops/products", shopProductsRouter);
app.use("/api/v1/shops/carts", shopCartRouter);
app.use("/api/v1/shops/addresses", shopAddressRouter);
app.use("/api/v1/shops/orders", shopOrderRouter);
app.use("/api/v1/shops/searches", shopSearchRouter);
app.use("/api/v1/shops/reviews", shopReviewRouter);
app.use("/api/v1/shops/wishlists", shopWishlistRouter);

app.use("/api/v1/commons/features", commonFeatureRouter);

module.exports = app;

if (process.env.NODE_ENV !== "production" || !process.env.VERCEL) {
  app.listen(PORT || 5000, () => console.log(`Server is now running on port ${PORT || 5000}`));
}