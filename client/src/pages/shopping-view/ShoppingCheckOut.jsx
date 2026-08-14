import Address from "@/components/shopping-view/Address";
import img from "../../assets/account.jpg";
import { useDispatch, useSelector } from "react-redux";
import UserCartItemsContent from "@/components/shopping-view/UserCartItemsContent";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { createNewOrder } from "@/store/shop/order-slice";
import { fetchCartItems } from "@/store/shop/cart-slice";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { Banknote, CreditCard } from "lucide-react";

function ShoppingCheckout() {
  const { cartItems } = useSelector((state) => state.shopCart);
  const { user } = useSelector((state) => state.auth);
  const { approvalURL } = useSelector((state) => state.shopOrder);
  const [currentSelectedAddress, setCurrentSelectedAddress] = useState(null);
  const [paymentMethod, setPaymentMethod] = useState("cod");
  const [isPaymentStart, setIsPaymentStart] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const totalCartAmount =
    cartItems && cartItems.items && cartItems.items.length > 0
      ? cartItems.items.reduce(
          (sum, currentItem) =>
            sum +
            (currentItem?.salePrice > 0
              ? currentItem?.salePrice
              : currentItem?.price) *
              currentItem?.quantity,
          0
        )
      : 0;

  function handleCreateOrder() {
    if (!cartItems?.items || cartItems.items.length === 0) {
      toast.error("Your cart is empty. Please add items to proceed.");
      return;
    }
    if (currentSelectedAddress === null) {
      toast.error("Please select an address to proceed.");
      return;
    }

    const orderData = {
      userId: user?.id,
      cartId: cartItems?._id,
      cartItems: cartItems.items.map((singleCartItem) => ({
        productId: singleCartItem?.productId,
        title: singleCartItem?.title,
        image: singleCartItem?.image,
        price:
          singleCartItem?.salePrice > 0
            ? singleCartItem?.salePrice
            : singleCartItem?.price,
        quantity: singleCartItem?.quantity,
      })),
      addressInfo: {
        addressId: currentSelectedAddress?._id,
        address: currentSelectedAddress?.address,
        city: currentSelectedAddress?.city,
        pincode: currentSelectedAddress?.pincode,
        phone: currentSelectedAddress?.phone,
        notes: currentSelectedAddress?.notes,
      },
      orderStatus: paymentMethod === "cod" ? "confirmed" : "pending",
      paymentMethod,
      paymentStatus: paymentMethod === "cod" ? "pending" : "pending",
      totalAmount: totalCartAmount,
      orderDate: new Date(),
      orderUpdateDate: new Date(),
      paymentId: "",
      payerId: "",
    };

    setIsPaymentStart(true);
    dispatch(createNewOrder(orderData)).then((data) => {
      if (data?.payload?.success) {
        if (data?.payload?.isCOD) {
          toast.success("Order placed successfully with Cash on Delivery!");
          dispatch(fetchCartItems(user?.id));
          navigate("/shop/payment-success");
        }
      } else {
        setIsPaymentStart(false);
        toast.error("Something went wrong while creating the order.");
      }
    });
  }

  // Redirect to PayPal if approval URL exists
  if (approvalURL && paymentMethod === "paypal") {
    window.location.href = approvalURL;
    return null;
  }

  return (
    <div className="flex flex-col">
      <div className="relative h-[300px] w-full overflow-hidden">
        <img src={img} className="h-full w-full object-cover object-center" alt="Checkout Banner" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-5 p-5">
        <Address
          selectedId={currentSelectedAddress}
          setCurrentSelectedAddress={setCurrentSelectedAddress}
        />
        <div className="flex flex-col gap-4">
          {cartItems && cartItems.items && cartItems.items.length > 0
            ? cartItems.items.map((item) => (
                <UserCartItemsContent key={item.productId} cartItem={item} />
              ))
            : <p className="text-muted-foreground">No items in the cart.</p>}
          <div className="mt-8 space-y-4">
            <div className="flex justify-between">
              <span className="font-bold text-lg">Total Amount</span>
              <span className="font-bold text-lg">${totalCartAmount.toFixed(2)}</span>
            </div>
          </div>

          {/* Payment Method Selector */}
          <div className="space-y-3 mt-4 border p-4 rounded-lg bg-card shadow-sm">
            <h3 className="font-semibold text-md">Select Payment Method</h3>
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => setPaymentMethod("cod")}
                className={`flex items-center justify-center gap-2 p-3 rounded-md border font-medium transition-all ${
                  paymentMethod === "cod"
                    ? "border-primary bg-primary/10 text-primary font-bold"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <Banknote className="w-5 h-5" />
                <span>Cash on Delivery</span>
              </button>

              <button
                type="button"
                onClick={() => setPaymentMethod("paypal")}
                className={`flex items-center justify-center gap-2 p-3 rounded-md border font-medium transition-all ${
                  paymentMethod === "paypal"
                    ? "border-primary bg-primary/10 text-primary font-bold"
                    : "border-gray-200 text-gray-700 hover:bg-gray-50"
                }`}
              >
                <CreditCard className="w-5 h-5" />
                <span>PayPal</span>
              </button>
            </div>
          </div>

          <div className="mt-4 w-full">
            <Button 
              onClick={handleCreateOrder} 
              className="w-full" 
              disabled={isPaymentStart}
            >
              {isPaymentStart
                ? "Processing Order..."
                : paymentMethod === "cod"
                ? "Place Order (Cash on Delivery)"
                : "Checkout with PayPal"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ShoppingCheckout;