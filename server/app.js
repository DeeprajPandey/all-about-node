const express = require('express');
const cors = require('cors');
const jsrsa = require('jsrsasign');

const app = express();

app.use(express.json());
app.use(cors());

app.get('/keygen', (req, res, next) => {
  try {
    const { prvKeyObj: privKey, pubKeyObj: pubKey } = jsrsa.KEYUTIL.generateKeypair('RSA', 2048);
    const passcode = '1025';
    const privKeyPEM = jsrsa.KEYUTIL.getPEM(privKey, 'PKCS8PRV', passcode);
    const pubKeyPEM = jsrsa.KEYUTIL.getPEM(pubKey);

    let sig = new jsrsa.KJUR.crypto.Signature({ alg: "SHA512withRSA" });
    sig.init(privKeyPEM, passcode);
    sig.updateString('covidbloc');
    const sigHex = sig.sign();

    res.json({ priv: privKeyPEM, pub: pubKeyPEM, sig: sigHex });
  } catch (err) {
    next(err);
  }
});

app.post('/sign', (req, res, next) => {
  try {
    const passcode = req.body.pass;
    const privKeyPEM = req.body.priv;

    let sig = new jsrsa.KJUR.crypto.Signature({ alg: "SHA512withRSA" });
    sig.init(privKeyPEM, passcode);
    sig.updateString('covidbloc');
    const sigHex = sig.sign();

    // const privKey1 = jsrsa.KEYUTIL.getKeyFromEncryptedPKCS8PEM(privKeyPEM, passcode);
    // const privKey2 = jsrsa.KEYUTIL.getKey(privKeyPEM, passcode);
    // const pubKey = jsrsa.KEYUTIL.getKey(pubKeyPEM);

    res.json({ sig: sigHex });
  } catch (err) {
    next(err);
  }
});

app.post('/verify', (req, res, next) => {
  try {
    const sentSignature = req.body.sig;
    const pubKeyPEM = req.body.pub;
    let sig = new jsrsa.KJUR.crypto.Signature({ alg: "SHA512withRSA"});
    sig.init(pubKeyPEM);
    sig.updateString('covidbloc');

    const isValid = sig.verify(sentSignature);

    res.json({ valid: isValid });
  } catch (err) {
    next(err);
  }
});

app.post('/sms', (req, res, next) => {
  try {
    console.info(req.body);
    res.status(200).send("Patient notified, waiting for daily keys.");
  } catch (err) {
    next(err);
  }
});

app.post('/generateapproval', (req, res, next) => {
  try {
    res.status(200).json({apID: 1234567890});
  } catch (err) {
    next(err);
  }
});

app.post('/check-registration-status', (req, res, next) => {
  try {
    console.info(req.body);
    res.status(200).send("valid");
  } catch (err) {
    next(err);
  }
});

app.post('/register', (req, res, next) => {
  try {
    console.info(req.body);
    res.status(200).send("success");
  } catch (err) {
    next(err);
  }
});

app.use((req, res, next) => {
  res.status(404);
});

app.use((error, req, res, next) => {
  if (error.status) {
    res.status(error.status);
  } else {
    res.status(500);
  }
  res.json({
    message: error.message,
    stack: process.env.NODE_ENV === 'production' ? '🥞' : error.stack,
  });
});

const port = process.env.PORT || 1234;
app.listen(port, () => {
  console.log(`Listening at http://localhost:${port}`);
});