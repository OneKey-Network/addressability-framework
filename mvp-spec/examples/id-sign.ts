import * as fs from "fs";
import * as path from "path";
import {getStringToSign} from "./comon";

const ECDSA = require('ecdsa-secp256r1')
const ECKey = require('ec-key');

/**
 * To be called with the name of the message as first argument.
 * Example: ts-node id-sign.ts id.json
 */
const inputMessageFile = process.argv[2];

const jsonMsg = JSON.parse(fs.readFileSync(path.join(__dirname, inputMessageFile)).toString())

// Notice signing only requires private key
const privateKey = ECDSA.fromJWK(new ECKey(fs.readFileSync(path.join(__dirname, 'private_key.ecdsa-NIST256p'))))
const signature = privateKey.sign(getStringToSign(jsonMsg))

console.log(`Message:`)
console.log(JSON.stringify(jsonMsg, null, 2))

console.log("Signature:")
console.log(signature)
