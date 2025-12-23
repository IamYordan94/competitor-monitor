import Stripe from "stripe";

// Use a dummy key for development if not provided, but warn.
// Ideally process.env.STRIPE_SECRET_KEY should be set.
const STRIPE_SECRET_KEY = process.env.STRIPE_SECRET_KEY || "sk_test_placeholder";

export const stripe = new Stripe(STRIPE_SECRET_KEY, {
  apiVersion: "2025-01-27.acacia", // Use latest or matching version
  typescript: true,
});

export async function createCheckoutSession(userId: number, email: string) {
  const appUrl = process.env.APP_URL || "http://localhost:5000";

  const session = await stripe.checkout.sessions.create({
    customer_email: email,
    line_items: [{
      price_data: {
        currency: 'eur',
        product_data: {
          name: 'Competitor Monitor Starter',
          description: 'Daily monitoring for up to 5 URLs',
        },
        unit_amount: 900, // 9.00 EUR
        recurring: {
          interval: 'month',
        },
      },
      quantity: 1,
    }],
    mode: 'subscription',
    success_url: `${appUrl}/success?session_id={CHECKOUT_SESSION_ID}&email=${email}&userId=${userId}`,
    cancel_url: `${appUrl}/?canceled=true`,
    metadata: { userId: userId.toString() },
  });

  return session;
}

export async function handleWebhook(body: any, signature: string | Buffer) {
  // Verify signature if using real Stripe
  let event: Stripe.Event;

  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  try {
    if (webhookSecret) {
      event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
    } else {
      console.warn("No STRIPE_WEBHOOK_SECRET set, skipping signature verification for dev.");
      event = body;
    }
  } catch (err: any) {
    console.error(`Webhook signature verification failed: ${err.message}`);
    throw new Error(`Webhook Error: ${err.message}`);
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      console.log(`Payment successful for session: ${session.id}`);

      // Here we would:
      // 1. Get userId from session.metadata.userId
      // 2. Activate subscription in DB
      // 3. Create any pending monitors if needed
      if (session.metadata?.userId) {
        const userId = parseInt(session.metadata.userId);
        // await storage.updateUserSubscription(userId, "active"); // Implementation pending in storage
        console.log(`Activating subscription for user ${userId}`);
      }
      break;
    }
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      // Handle cancellation
      console.log("Subscription deleted", subscription.id);
      break;
    }
    default:
      console.log(`Unhandled event type ${event.type}`);
  }
}
