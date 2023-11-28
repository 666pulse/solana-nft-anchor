const fs = require('fs');
const bs58 = require('bs58');

async function main() {
  const path = "./script/new-keypair.json";
  const base58format = "./script/base58format.txt";

  var byte_arr;

  try {
    const data = fs.readFileSync(path, 'utf8');
    byte_arr = data;
  } catch (err) {
    console.error(err);
    return;
  }

  const secret = JSON.parse(byte_arr);
  const uint8Array = new Uint8Array(secret);
  const privateKey = bs58.encode(uint8Array)

  fs.writeFile(base58format, privateKey, 'utf8', (err) => {
    if (err) {
      console.error(err);
      return;
    }
    console.log('File has been saved!');
  });
}

main()
