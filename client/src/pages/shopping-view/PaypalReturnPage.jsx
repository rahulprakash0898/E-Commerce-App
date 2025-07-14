// import { Card, CardHeader, CardTitle } from "@/components/ui/card";
// import { capturePayment } from "@/store/shop/order-slice";
// import { useEffect } from "react";
// import { useDispatch } from "react-redux";
// import { useLocation } from "react-router-dom";

// function PaypalReturnPage() {
//   const dispatch = useDispatch();
//   const location = useLocation();
//   const params = new URLSearchParams(location.search);
//   const paymentId = params.get("paymentId");
//   const payerId = params.get("PayerID");

//   useEffect(() => {
//     if (paymentId && payerId) {
//       const orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));

//       dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
//         if (data?.payload?.success) {
//           sessionStorage.removeItem("currentOrderId");
//           window.location.href = "/shop/payment-success";
//         }
//       });
//     }
//   }, [paymentId, payerId, dispatch]);

//   return (
//     <Card>
//       <CardHeader>
//         <CardTitle>Processing Payment...Please wait!</CardTitle>
//       </CardHeader>
//     </Card>
//   );
// }

// export default PaypalReturnPage;

import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { capturePayment } from "@/store/shop/order-slice";
import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react"; 

function PaypalReturnPage() {
  const dispatch = useDispatch();
  const location = useLocation();
  const [error, setError] = useState(null);

  const params = new URLSearchParams(location.search);
  const paymentId = params.get("paymentId");
  const payerId = params.get("PayerID");

  useEffect(() => {
    if (paymentId && payerId) {
      let orderId = null;
      try {
        orderId = JSON.parse(sessionStorage.getItem("currentOrderId"));
      } catch (e) {
        console.error("Invalid or missing order ID", e);
        setError("Missing or invalid order information.");
        return;
      }

      dispatch(capturePayment({ paymentId, payerId, orderId })).then((data) => {
        if (data?.payload?.success) {
          sessionStorage.removeItem("currentOrderId");
          window.location.href = "/shop/payment-success";
        } else {
          setError("Payment failed or was not confirmed.");
        }
      });
    }
  }, [paymentId, payerId, dispatch]);

  return (
    <Card className="p-10 text-center">
      <CardHeader>
        <CardTitle className="flex items-center justify-center gap-2 text-xl">
          {error ? (
            error
          ) : (
            <>
              <Loader2 className="animate-spin" />
              Processing Payment...Please wait!
            </>
          )}
        </CardTitle>
      </CardHeader>
    </Card>
  );
}

export default PaypalReturnPage;