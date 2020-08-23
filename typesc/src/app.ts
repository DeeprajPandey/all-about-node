import express from 'express';
import jsrsasign from 'jsrsasign';

const app = express();
const port = 3000;
app.get('/', (req, res) => {
  const { prvKeyObj: privKey, pubKeyObj: pubKey } = jsrsasign.KEYUTIL.generateKeypair('RSA', 2048);
  res.send('The sedulous hyena ate the antelope!');
});
app.listen(port, err => {
  if (err) {
    return console.error(err);
  }
  return console.log(`server is listening on ${port}`);
});