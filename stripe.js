require('dotenv').config();
const express = require('express');
const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const cors = require('cors');
const bodyParser = require('body-parser');
const db = require('./db/config');
// Import database connection
const router = express.Router();

router.use(cors());
router.use(bodyParser.json());
router.use(express.static("public"));



router.get('/', async (req, res) =>{
    res.send({
        publicKey: process.env.STRIPE_PUB_KEY
    });
})

// Deposit funds into wallet
router.post('/deposit', async (req, res) => {
    try {
        // const { amount, currency, paymentMethodId } = req.body;

        // Create a PaymentIntent
        const paymentIntent = await stripe.paymentIntents.create({
            amount: "50" * 100, // Convert to cents
            currency:"USD",
            automatic_payment_methods: {enabled: true},
        });

        res.json({ success: true, client_secret: paymentIntent.client_secret});
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
});

router.post('/create-payment-intent', async (req, res) => {
    try {
        const { currency, paymentMethodType } = req.body;

        const amount = req.body.amount;
        const paymentIntent = await stripe.paymentIntents.create({
            amount:Number(amount), // Amount in smallest currency unit (e.g., cents)
            currency:"usd",
            automatic_payment_methods: {enabled: true}, // Supports card, mobilepay, bank transfer, etc.
        });

        res.json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});



router.post("/webhook", async (req, res) => {
    const sig = req.headers["stripe-signature"];
    
    let event;
    try {
        event = stripe.webhooks.constructEvent(req.body, sig, "whsec_C9TYIcj6II6biXVzZXfja70W3KVI1vkG");
    } catch (err) {
        console.error("⚠️ Webhook signature verification failed.", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle successful payment
    if (event.type === "payment_intent.succeeded") {
        const paymentIntent = event.data.object;
        
        // Example: Update user wallet in the database
        const userId = paymentIntent.metadata.userId;  // Ensure metadata is set in frontend
        const amount = paymentIntent.amount_received / 100; // Convert from cents

        await updateUserWallet(userId, amount); // Function to update wallet in DB

        console.log(`✅ Wallet updated for User ${userId}: +$${amount}`);
    }

    res.json({ received: true });
});


router.post("/confirm-payment", async (req, res) => {
    const { paymentIntent,uid } = req.body;

    try {
        const intent = await stripe.paymentIntents.retrieve(paymentIntent);

        if (intent.status === "succeeded") {
            console.log(`✅ Payment confirmed: ${paymentIntent} | Amount: ${intent.amount}`);

            res.json({
                success: true,
                message: "Payment confirmed , Deposit successful",
                amount: intent.amount, // Amount is in cents (Stripe default)
                currency: intent.currency
            });


            if (intent.status === 'succeeded') {
                // Update user wallet balance in MySQL
                await db.query(
                    "UPDATE users SET wallet_balance = wallet_balance + ? WHERE uid = ?",
                    [intent.amount, uid]
                );
                console.log(`✅ Deposit successful: ${paymentIntent} | Amount: ${intent.amount}`);
                // return res.json({ message: "Deposit successful" });
            } else {
                return res.status(400).json({ success: false, message: "Payment not successful" });
            }
   

        } else {
            res.json({ success: false, message: "Payment not confirmed yet" });
        }
    } catch (error) {
        console.error("Error retrieving payment intent:", error);
        res.status(500).json({ success: false, error: error.message });
    }
});


router.post("/withdraw", async (req, res) => {
    const { userId, amount } = req.body;
    const amountInCents = amount * 100;

    try {
        // Fetch user's Stripe account ID from MySQL
        const [user] = await db.execute("SELECT stripe_account_id, wallet_balance FROM users WHERE id = ?", [userId]);

        if (!user || !user[0].stripe_account_id) {
            return res.status(400).json({ success: false, message: "Stripe account not found." });
        }

        if (user[0].wallet_balance < amount) {
            return res.status(400).json({ success: false, message: "Insufficient balance." });
        }

        // Create a test payout
        const payout = await stripe.payouts.create({
            amount: amountInCents,
            currency: "usd",
            method: "standard",
            destination: user[0].stripe_account_id, // Must be a bank account
        });

        // Deduct from MySQL wallet balance
        await db.execute("UPDATE users SET wallet_balance = wallet_balance - ? WHERE id = ?", [amount, userId]);

        res.json({ success: true, message: "Test withdrawal initiated!", payoutId: payout.id });
    } catch (error) {
        console.error("Test Withdrawal Error:", error);
        res.status(500).json({ success: false, message: "Error processing test withdrawal." });
    }
});



module.exports = router;