import * as fs from "fs";
import * as path from "path";
const ECDSA = require('ecdsa-secp256r1')
const ECKey = require('ec-key');

const privateKey = ECDSA.fromJWK(new ECKey(fs.readFileSync(path.join(__dirname, 'signing_key.ecdsa-NIST256p'))))
const pubKey = ECDSA.fromJWK(new ECKey(fs.readFileSync(path.join(__dirname, 'verifying_key.ecdsa-NIST256p'))))

const id = JSON.parse(fs.readFileSync(path.join(__dirname, "..", "id.json")).toString())

const stringToSign = [
    id.source.domain,
    id.source.timestamp,
    id.type,
    id.value
].join('\u2063')

const signature = privateKey.sign(stringToSign)

console.log(`Signature for ${stringToSign}`)
console.log(signature)

const isOk = pubKey.verify(stringToSign, signature)

console.log(`Verficiation: ${isOk}`)
