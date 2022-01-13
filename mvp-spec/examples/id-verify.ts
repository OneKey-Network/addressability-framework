import * as fs from "fs";
import * as path from "path";
import {getStringToSign} from "./comon";

const ECDSA = require('ecdsa-secp256r1')
const ECKey = require('ec-key');

/**
 * To be called with the name of the message as first argument and the signature as the second one
 * Example: ts-node id-sign.ts id.json
 */
const inputMessageFile = process.argv[2];
const signature = process.argv[3];

const jsonMsg = JSON.parse(fs.readFileSync(path.join(__dirname, inputMessageFile)).toString())

// Notice verifying only requires public key
export const pubKey = ECDSA.fromJWK(new ECKey(fs.readFileSync(path.join(__dirname, 'public_key.ecdsa-NIST256p'))))
const isOk = pubKey.verify(getStringToSign(jsonMsg), signature)

console.log("Verification:")
console.log(isOk)
