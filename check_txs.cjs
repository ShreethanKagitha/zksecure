const algosdk = require('algosdk');
const indexerClient = new algosdk.Indexer('', 'https://testnet-idx.algonode.cloud', '');

async function run() {
  const addr = '4M5I36SOF3DZS5WWOGFF7RL3HEZUDP27EKLOTTGOAIDP65JCR75LYK64CY';
  const info = await indexerClient.lookupAccountTransactions(addr).do();
  console.log(JSON.stringify(info.transactions.slice(0, 3), null, 2));
}

run().catch(console.error);
