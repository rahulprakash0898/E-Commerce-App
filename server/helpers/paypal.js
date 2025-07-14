const paypal = require("@paypal/checkout-server-sdk");
require("dotenv").config();

function environment() {
  const clientId = process.env.PAYPAL_CLIENT_ID;
  const clientSecret = process.env.PAYPAL_CLIENT_SECRET;

  if (process.env.PAYPAL_MODE === "sandbox") {
    return new paypal.core.SandboxEnvironment(clientId, clientSecret);
   
  } else {
    
    return new paypal.core.LiveEnvironment(clientId, clientSecret);
  }
}

function client() {
  return new paypal.core.PayPalHttpClient(environment());
}

module.exports = { client, paypal };
