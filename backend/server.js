const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const algosdk = require('algosdk');

const app = express();
const PORT = 5000;

// Enable CORS
app.use(cors());

// Enable JSON body parsing
app.use(express.json());

// MongoDB Connection
mongoose.connect('mongodb://127.0.0.1:27017/zktls')
.then(() => console.log('MongoDB Connected'))
.catch(err => console.error('MongoDB connection error:', err));

// Mongoose Schema & Model (Strict Privacy Enforced)
const verificationSchema = new mongoose.Schema({
  wallet: { type: String, required: true },
  status: { type: String, required: true },
  condition: { type: String, required: true },
  txId: { type: String, default: null },
  timestamp: { type: Date, default: Date.now },
  // STRICT ZK PRIVACY: No balance, input, or raw witness fields exist in this schema.
});

const Verification = mongoose.model('Verification', verificationSchema);

// Algorand Testnet Setup
const algoServer = "https://testnet-api.algonode.cloud";
const algodClient = new algosdk.Algodv2("", algoServer, "");

// Basic Route
app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

// Verification Endpoint
app.post('/verify', async (req, res) => {
  const { wallet, balance, threshold, ...otherFields } = req.body;
  
  // SANITIZATION: Explicitly reject persisting anything but what we verify into the final object later.
  
  // LOGGING COMPLIANCE: Do not log sensitive financial data unconditionally
  if (process.env.NODE_ENV === 'production') {
     console.log(`[POST /verify] Incoming request - Wallet: ${wallet}. (Financial inputs hidden for privacy in PRD)`);
  } else {
     console.log(`[POST /verify] Incoming request - Wallet: ${wallet}, Balance: ${balance}, Threshold: ${threshold}`);
  }

  if (balance === undefined || balance === null || typeof balance !== 'number') {
    return res.status(400).json({ error: "Invalid or missing 'balance' parameter. Must be a number." });
  }

  if (threshold === undefined || threshold === null || typeof threshold !== 'number') {
    return res.status(400).json({ error: "Invalid or missing 'threshold' parameter. Must be a number." });
  }

  if (!wallet) {
    return res.status(400).json({ error: "Invalid or missing 'wallet' parameter." });
  }
  
  const status = balance >= threshold ? 'VERIFIED' : 'NOT VERIFIED';
  const condition = `Balance ≥ ₹${threshold}`;
  console.log(`[POST /verify] Verification Logic Evaluated: ${status}`);

  let generatedTxId = null;

  try {
    // Generate anchor transaction via Algorand Testnet
    const suggestedParams = await algodClient.getTransactionParams().do();
    const noteContent = `zkTLS Statement | Condition: ${condition} | Status: ${status} | Auth: ${wallet}`;
    const noteArray = new Uint8Array(Buffer.from(noteContent));
    
    // Build a mock simulated transaction to capture an authentic Algorand TXID hash
    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: wallet,
      to: wallet,
      amount: 0,
      note: noteArray,
      suggestedParams: suggestedParams
    });
    
    generatedTxId = txn.txID().toString();
    console.log(`[POST /verify] Algorand txId uniquely generated: ${generatedTxId}`);
  } catch (algoError) {
    console.error(`[POST /verify] Algorand anchoring generation failed:`, algoError.message);
    generatedTxId = null;
  }

  try {
    // PRIVACY ENFORCEMENT: construct the exact document exclusively with public metadata. 
    // We intentionally ignore `balance`, `threshold`, and `otherFields` to prevent leakage.
    const privacyPreservedDoc = {
      wallet,
      status,
      condition,
      txId: generatedTxId,
      timestamp: new Date()
    };
    
    const newVerification = new Verification(privacyPreservedDoc);
    await newVerification.save();
    
    return res.json({
      status: newVerification.status,
      condition: newVerification.condition,
      txId: newVerification.txId,
      timestamp: newVerification.timestamp.toISOString()
    });
  } catch (error) {
    console.error('[POST /verify] Database error:', error);
    return res.status(500).json({ error: 'Failed to save verification result to database' });
  }
});

// History Endpoint
app.get('/history/:wallet', async (req, res) => {
  const { wallet } = req.params;
  
  try {
    const history = await Verification.find({ wallet }).sort({ timestamp: -1 });
    return res.json(history);
  } catch (error) {
    console.error(`[GET /history/${wallet}] Database error:`, error);
    return res.status(500).json({ error: 'Failed to retrieve verification history' });
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
