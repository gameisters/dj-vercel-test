const requireAuth = require("./_require-auth.js");
const { getUser, getCustomer, createCustomer } = require("./_db.js");
const stripe = require("./_stripe.js");

export default requireAuth(async (req, res) => {
  const body = req.body;
  const user = req.user;

//   if (!body.priceId) {
//     return res.status(400).send({
//       status: "error",
//       message: "No priceId is defined in request body",
//     });
//   }

  try {
    const { email } = await getUser(user.id);
    let { stripe_customer_id } = (await getCustomer(user.id)) || {};

    // If user is not a customer then create a customer in Stripe
    if (!stripe_customer_id) {
      const customer = await stripe.customers.create({ email: email });

      await createCustomer(user.id, {
        stripe_customer_id: customer.id,
      });

      stripe_customer_id = customer.id;
    }

    // Create a checkout session
    const session = await stripe.checkout.sessions.create({
      customer: stripe_customer_id,
      payment_method_types: ["card"],
      line_items: [
        {
          price_data: {
            currency: 'usd',
            unit_amount: body.price, 
            product_data: {
                name: 'product data'
            }
          },
          quantity: 1,
        },
      ],
      mode: "payment",
      // Uncomment to allow user to enter a promotional code
      //allow_promotion_codes: true,
      // Uncomment if you need address collection
      //billing_address_collection: "required",
      //shipping_address_collection: { allowed_countries: ['US'] },
      success_url: body.successUrl,
      cancel_url: body.cancelUrl,
    });

    // Return success response
    res.send({ status: "success", data: session });
  } catch (error) {
    console.log("stripe-create-checkout-session error", error);

    // Return error response
    res.send({ status: "error", code: error.code, message: error.message });
  }
});
