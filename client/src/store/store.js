// import { configureStore } from "@reduxjs/toolkit";
// import authReducer from './auth-slice'
// import adminProductsSlice  from "./admin/products-slice";
// import shopProductsSlice  from "./shop/products-slice";
// import shopCartSlice from "./shop/cart-slice"
// import shopAddress from "./shop/cart-slice/index"
// import commonFeatureSlice from "./common-slice/index";

// const store = configureStore({
//     reducer: {
//         auth: authReducer,
//         adminProducts: adminProductsSlice,
//         shopProducts: shopProductsSlice,
//         shopCart: shopCartSlice,
//         shopAddress: shopAddress,

//         commonFeature: commonFeatureSlice,
//     },
// });

// export default store;


import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./auth-slice";
import adminProductsSlice from "./admin/products-slice";
import adminOrderSlice from "./admin/order-slice";

import shopProductsSlice from "./shop/products-slice";
import shopCartSlice from "./shop/cart-slice";
import shopAddressSlice from "./shop/address-slice";
import shopOrderSlice from "./shop/order-slice";
import shopSearchSlice from "./shop/search-slice";
import shopReviewSlice from "./shop/review-slice";
import shopWishlistSlice from "./shop/wishlist-slice";
import commonFeatureSlice from "./common-slice";

const store = configureStore({
  reducer: {
    auth: authReducer,

    adminProducts: adminProductsSlice,
    adminOrder: adminOrderSlice,

    shopProducts: shopProductsSlice,
    shopCart: shopCartSlice,
    shopAddress: shopAddressSlice,
    shopOrder: shopOrderSlice,
    shopSearch: shopSearchSlice,
    shopReview: shopReviewSlice,
    shopWishlist: shopWishlistSlice,

    commonFeature: commonFeatureSlice,
  },
});

export default store;