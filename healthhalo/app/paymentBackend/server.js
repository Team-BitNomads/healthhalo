require('dotenv').config(); // This loads the .env file
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json()); // Use express's built-in parser

const PAYSTACK_SECRET_KEY = process.env.PAYSTACK_SECRET_KEY;
const PAYSTACK_BASE_URL = 'https://api.paystack.co';

// Your React app's success page URL
const FRONTEND_CALLBACK_URL = 'http://localhost:5173/payment/success';

/**
 * @route   POST /api/payment/initialize
 * @desc    Initializes a real payment with Paystack
 */
app.post('/api/payment/initialize', async (req, res) => {
  const { email, amount } = req.body;

  if (!email || !amount) {
    return res.status(400).json({ message: 'Email and amount are required.' });
  }

  const params = {
    email,
    amount: amount * 100, // Paystack requires amount in kobo
    callback_url: FRONTEND_CALLBACK_URL,
    metadata: {
      custom_fields: [
        { display_name: "App", variable_name: "app_name", value: "HealthHalo" }
      ]
    }
  };

  try {
    const paystackResponse = await axios.post(
      `${PAYSTACK_BASE_URL}/transaction/initialize`,
      params,
      {
        headers: {
          Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );

    console.log('Paystack response:', paystackResponse.data);
    res.status(200).json(paystackResponse.data);

  } catch (error) {
    console.error('Paystack Error:', error.response ? error.response.data : error.message);
    res.status(500).json({ message: 'Failed to initialize payment with Paystack.' });
  }
});

/**
 * @route   GET /api/payment/verify
 * @desc    Verifies a transaction with Paystack after redirect
 */
app.get('/api/payment/verify', async (req, res) => {
    const { reference } = req.query;

    if (!reference) {
        return res.status(400).json({ message: 'Transaction reference is required.' });
    }

    try {
        const paystackResponse = await axios.get(
            `${PAYSTACK_BASE_URL}/transaction/verify/${reference}`,
            {
                headers: {
                    Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
                },
            }
        );

        console.log('Verification Response:', paystackResponse.data);
        res.status(200).json(paystackResponse.data);

    } catch (error) {
        console.error('Paystack Verification Error:', error.response ? error.response.data : error.message);
        res.status(500).json({ message: 'Failed to verify transaction.' });
    }
});


app.listen(PORT, () => {
  console.log(`Paystack Payment Server is running on http://localhost:${PORT}`);
});