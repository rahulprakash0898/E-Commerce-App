const { client } = require("../../helpers/paypal");
const Order = require("../../models/Order");
const Cart = require("../../models/Cart");
const Product = require("../../models/Product");

const createOrder = async (req, res) => {
  try {
    const {
      userId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      cartId,
    } = req.body;

    // Handle Cash On Delivery
    if (paymentMethod === "cod") {
      const newlyCreatedOrder = new Order({
        userId,
        cartId,
        cartItems,
        addressInfo,
        orderStatus: "confirmed",
        paymentMethod: "cod",
        paymentStatus: "pending",
        totalAmount,
        orderDate,
        orderUpdateDate,
      });

      for (let item of cartItems) {
        const product = await Product.findById(item.productId);
        if (product) {
          product.totalStock -= item.quantity;
          await product.save();
        }
      }

      await Cart.findByIdAndDelete(cartId);
      await newlyCreatedOrder.save();

      return res.status(201).json({
        success: true,
        isCOD: true,
        orderId: newlyCreatedOrder._id,
        message: "Order placed successfully with Cash on Delivery!",
      });
    }

    const request = new (require("@paypal/checkout-server-sdk").orders.OrdersCreateRequest)();
    request.prefer("return=representation");

    request.requestBody({
      intent: "CAPTURE",
      purchase_units: [
        {
          amount: {
            currency_code: "USD",
            value: Number(totalAmount).toFixed(2),
            breakdown: {
              item_total: {
                currency_code: "USD",
                value: Number(totalAmount).toFixed(2),
              },
            },
          },
          items: cartItems.map((item) => ({
            name: item.title,
            unit_amount: {
              currency_code: "USD",
              value: Number(item.price).toFixed(2),
            },
            quantity: item.quantity.toString(),
          })),
        },
      ],
      application_context: {
        return_url: "http://localhost:5173/shop/paypal-return",
        cancel_url: "http://localhost:5173/shop/paypal-cancel",
      },
    });

    const orderResponse = await client().execute(request);

    const newlyCreatedOrder = new Order({
      userId,
      cartId,
      cartItems,
      addressInfo,
      orderStatus,
      paymentMethod,
      paymentStatus,
      totalAmount,
      orderDate,
      orderUpdateDate,
      paymentId: orderResponse.result.id,
    });

    await newlyCreatedOrder.save();

    const approvalLink = orderResponse.result.links.find(
      (link) => link.rel === "approve"
    ).href;

    res.status(201).json({
      success: true,
      approvalURL: approvalLink,
      orderId: newlyCreatedOrder._id,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Error creating order" });
  }
};


const capturePayment = async (req, res) => {
  try {
    const { paypalOrderId, orderId } = req.body;

    const request = new (require("@paypal/checkout-server-sdk").orders.OrdersCaptureRequest)(paypalOrderId);
    request.requestBody({});

    const captureResponse = await client().execute(request);

    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found" });
    }

    order.paymentStatus = "paid";
    order.orderStatus = "confirmed";
    order.payerId = captureResponse.result.payer.payer_id;
    order.paymentId = captureResponse.result.id;

    for (let item of order.cartItems) {
      const product = await Product.findById(item.productId);
      if (product) {
        product.totalStock -= item.quantity;
        await product.save();
      }
    }

    await Cart.findByIdAndDelete(order.cartId);
    await order.save();

    res.status(200).json({
      success: true,
      message: "Order confirmed and payment captured",
      data: order,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: "Payment capture failed" });
  }
};

const getAllOrdersByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.find({ userId });
    if (!orders.length) {
      return res.status(404).json({ success: false, message: "No orders found!" });
    }
    res.status(200).json({ success: true, data: orders });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Some error occurred!" });
  }
};

const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findById(id);
    if (!order) {
      return res.status(404).json({ success: false, message: "Order not found!" });
    }
    res.status(200).json({ success: true, data: order });
  } catch (e) {
    console.log(e);
    res.status(500).json({ success: false, message: "Some error occurred!" });
  }
};

module.exports = {
  createOrder,
  capturePayment,
  getAllOrdersByUser,
  getOrderDetails,
};