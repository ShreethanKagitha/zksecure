const algosdk = require('algosdk');
const ALGOD_SERVER = 'https://testnet-api.algonode.cloud';
const algodClient = new algosdk.Algodv2('', ALGOD_SERVER, '');

async function run() {
  try {
    const walletAddress = '4M5I36SOF3DZS5WWOGFF7RL3HEZUDP27EKLOTTGOAIDP65JCR75LYK64CY';
    console.log("Valid address?", algosdk.isValidAddress(walletAddress));
    const params = await algodClient.getTransactionParams().do();
    const encoder = new TextEncoder();
    const txn = algosdk.makePaymentTxnWithSuggestedParamsFromObject({
      from: walletAddress,
      to: walletAddress,
      amount: 0,
      note: encoder.encode(JSON.stringify({ test: 1 })),
      suggestedParams: params
    });
    console.log("Txn built successfully");
  } catch (e) {
    console.error("Error:", e.stack);
  }
}
run();
