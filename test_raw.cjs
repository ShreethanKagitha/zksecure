const algosdk = require('algosdk');

async function test() {
  const signed = [new Uint8Array([1, 2, 3])];
  console.log(algosdk.sendRawTransaction(signed));
}

test();
