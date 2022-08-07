import { loadStripe } from "@stripe/stripe-js";
import { apiRequest } from "./util";

let stripe;
// Load the Stripe script
loadStripe(process.env.REACT_APP_STRIPE_PUBLISHABLE_KEY, {
  // Pin to specific version of the Stripe API
  apiVersion: "2020-08-27",
}).then((stripeInstance) => {
  // Set stripe so all functions below have it in scope
  stripe = stripeInstance;
});



export async function redirectToCheckout(number) {
  
  const price=number.data[0].price * 100

  console.log(number)
  // console.log("number = ", number.data[0].price)



  // Create a checkout session
  const session = await apiRequest("stripe-create-checkout-session-once", "POST", {
    price: number.data[0].price * 100,
    successUrl: `${window.location.origin}/dashboard?paid=true`,
    cancelUrl: `${window.location.origin}/signup`,
  });


  // Ensure if user clicks browser back button from checkout they go to /signup
  // instead of this page or they'll redirect right back to checkout.
  window.history.replaceState({}, "", "/signup");

  // Redirect to checkout
  return stripe.redirectToCheckout({
    sessionId: session.id,
  });
}

export async function redirectToBilling() {
  // Create a billing session
  const session = await apiRequest("stripe-create-billing-session", "POST", {
    returnUrl: `${window.location.origin}/settings/general`,
  });

  // Ensure if user clicks browser back button from billing they go to /settings/general
  // instead of this page or they'll redirect right back to billing.
  window.history.replaceState({}, "", "/settings/general");

  // Redirect to billing session url
  window.location.href = session.url;
}
