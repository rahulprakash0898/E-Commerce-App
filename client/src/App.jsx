// import { Route, Routes } from "react-router-dom";

// import AuthLayout from "./components/auth/AuthLayout";
// import AuthLogin from "./pages/auth/AuthLogin";
// import AuthRegister from "./pages/auth/AuthRegister";
// import AdminLayout from "./components/admin-view/AdminLayout";
// import AdminDashboard from "./pages/admin-view/AdminDashboard";
// import AdminProducts from "./pages/admin-view/AdminProducts";
// import AdminOrders from "./pages/admin-view/AdminOrders";
// import AdminFeatures from "./pages/admin-view/AdminFeatures";
// import ShoppingLayout from "./components/shopping-view/ShoppingLayout";
// import NotFound from "./pages/not-found/NotFound";
// import ShoppingHome from "./pages/shopping-view/ShoppingHome";
// import ShoppingListing from "./pages/shopping-view/ShoppingListing";
// import ShoppingCheckOut from "./pages/shopping-view/ShoppingCheckOut";
// import ShoppingAccount from "./pages/shopping-view/ShoppingAccount";
// import CheckAuth from "./components/common/CheckAuth";
// import UnAuthPage from "./pages/unauth-page/UnAuthPage";
// import { useDispatch, useSelector } from "react-redux";
// import { useEffect } from "react";
// import { checkAuth } from "./store/auth-slice";
// import { Skeleton } from "./components/ui/skeleton";

// const App = () => {

//   const { user, isAuthenticated, isLoading } = useSelector(
//     (state) => state.auth
//   );

//   const dispatch = useDispatch();

//   useEffect(() => {
//     dispatch(checkAuth());
//   }, [dispatch]);

//   if(isLoading) return <Skeleton className="w-[800] bg-black h-[600px]" />;

//   console.log(isLoading, user);

//   return (
//     <div className="flex flex-col overflow-hidden bg-white">
      
      
//       <Routes>
//     {/* Authentication Routes */}
//     <Route path="/auth" element={
//       <CheckAuth isAuthenticated={isAuthenticated} user={user}>
//         <AuthLayout/>
//         </CheckAuth>}>
//     <Route path="login" element={<AuthLogin/>}/>
//     <Route path="register" element={<AuthRegister/>}/>
//     </Route>

//  {/* Admin Routes */}
//  <Route path="/admin" element={
//       <CheckAuth isAuthenticated={isAuthenticated} user={user}>
//       <AdminLayout/>
//       </CheckAuth>}>
//     <Route path="dashboard" element={<AdminDashboard/>}/>
//     <Route path="products" element={<AdminProducts/>}/>
//     <Route path="orders" element={<AdminOrders/>}/>
//     <Route path="features" element={<AdminFeatures/>}/>

//     </Route>

// {/* Shopping Routes */}
// <Route path="/shop" element={
//       <CheckAuth isAuthenticated={isAuthenticated} user={user}>
//       <ShoppingLayout/>
//       </CheckAuth>}>
// <Route path="home" element={<ShoppingHome/>}/>
//     <Route path="listing" element={<ShoppingListing/>}/>
//     <Route path="checkout" element={<ShoppingCheckOut/>}/>
//     <Route path="accounts" element={<ShoppingAccount/>}/>

//       </Route>
//       <Route path="/unauth-page" element={<UnAuthPage/>}/>
// <Route path="*" element={<NotFound/>}/>

//     </Routes>
//     </div>
//   )
// }

// export default App



import { Route, Routes } from "react-router-dom";
import AuthLayout from "./components/auth/AuthLayout";
import AuthLogin from "./pages/auth/AuthLogin";
import AuthRegister from "./pages/auth/AuthRegister";
import AdminLayout from "./components/admin-view/AdminLayout";
import AdminDashboard from "./pages/admin-view/AdminDashboard";
import AdminProducts from "./pages/admin-view/AdminProducts";
import AdminOrders from "./pages/admin-view/AdminOrders";
import AdminFeatures from "./pages/admin-view/AdminFeatures";
import ShoppingLayout from "./components/shopping-view/ShoppingLayout";
import NotFound from "./pages/not-found/NotFound";
import ShoppingHome from "./pages/shopping-view/ShoppingHome";
import ShoppingListing from "./pages/shopping-view/ShoppingListing";
import ShoppingCheckOut from "./pages/shopping-view/ShoppingCheckOut";
import ShoppingAccount from "./pages/shopping-view/ShoppingAccount";
import CheckAuth from "./components/common/CheckAuth";
import UnAuthPage from "./pages/unauth-page/UnAuthPage";
import { useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { checkAuth } from "./store/auth-slice";
import { Skeleton } from "./components/ui/skeleton";
import PaypalReturnPage from "./pages/shopping-view/PaypalReturnPage";
import PaymentSuccessPage from "./pages/shopping-view/PaymentSuccessPage";
import SearchProducts from "./pages/shopping-view/SearchProducts";


function App() {
  const { user, isAuthenticated, isLoading } = useSelector(
    (state) => state.auth
  );
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(checkAuth());
  }, [dispatch]);

  if (isLoading) return <Skeleton className="w-[800] bg-black h-[600px]" />;

  console.log(isLoading, user);

  return (
    <div className="flex flex-col overflow-hidden bg-white">
      <Routes>
        <Route
          path="/"
          element={
            <CheckAuth
              isAuthenticated={isAuthenticated}
              user={user}
            ></CheckAuth>
          }
        />
        <Route
          path="/auth"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AuthLayout />
            </CheckAuth>
          }
        >
          <Route path="login" element={<AuthLogin />} />
          <Route path="register" element={<AuthRegister />} />
        </Route>
        <Route
          path="/admin"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <AdminLayout />
            </CheckAuth>
          }
        >
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="products" element={<AdminProducts />} />
          <Route path="orders" element={<AdminOrders />} />
          <Route path="features" element={<AdminFeatures />} />
        </Route>
        <Route
          path="/shop"
          element={
            <CheckAuth isAuthenticated={isAuthenticated} user={user}>
              <ShoppingLayout />
            </CheckAuth>
          }
        >
          <Route path="home" element={<ShoppingHome />} />
          <Route path="listing" element={<ShoppingListing />} />
          <Route path="checkout" element={<ShoppingCheckOut />} />
          <Route path="account" element={<ShoppingAccount />} />
          <Route path="paypal-return" element={<PaypalReturnPage />} />
          <Route path="payment-success" element={<PaymentSuccessPage />} />
          <Route path="search" element={<SearchProducts />} />
        </Route>
        <Route path="/unauth-page" element={<UnAuthPage />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </div>
  );
}

export default App;