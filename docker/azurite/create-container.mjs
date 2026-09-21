// Creates the blob container in Azurite, then exits. Signs the request with SharedKey
// so no extra image (azure-cli is ~1 GB) is needed; runs on the Node inside the Azurite image.
import { createHmac } from 'node:crypto';

const account = process.env.AZURITE_ACCOUNT;
const key = process.env.AZURITE_KEY;
const endpoint = process.env.AZURITE_BLOB_ENDPOINT; // e.g. http://azurite:10000/devstoreaccount1
const container = process.env.AZURITE_CONTAINER;

const url = new URL(`${endpoint}/${container}?restype=container`);
const date = new Date().toUTCString();
const version = '2021-12-02';

const stringToSign = [
  'PUT',
  '', // Content-Encoding
  '', // Content-Language
  '', // Content-Length (empty when 0)
  '', // Content-MD5
  '', // Content-Type
  '', // Date (x-ms-date is used instead)
  '', // If-Modified-Since
  '', // If-Match
  '', // If-None-Match
  '', // If-Unmodified-Since
  '', // Range
  `x-ms-date:${date}\nx-ms-version:${version}`,
  `/${account}${url.pathname}\nrestype:container`,
].join('\n');

const signature = createHmac('sha256', Buffer.from(key, 'base64'))
  .update(stringToSign, 'utf8')
  .digest('base64');

const res = await fetch(url, {
  method: 'PUT',
  headers: {
    'x-ms-date': date,
    'x-ms-version': version,
    Authorization: `SharedKey ${account}:${signature}`,
  },
});

if (res.status === 201) {
  console.log(`Container "${container}" created.`);
} else if (res.status === 409) {
  console.log(`Container "${container}" already exists.`);
} else {
  console.error(`Failed to create container: ${res.status} ${await res.text()}`);
  process.exit(1);
}
