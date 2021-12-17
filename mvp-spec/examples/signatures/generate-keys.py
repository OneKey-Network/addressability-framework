from ecdsa import SigningKey, NIST256p

sk = SigningKey.generate(curve=NIST256p)

f = open("signing_key.ecdsa-NIST256p", "wb")
f.write(sk.to_pem())
f.close()

f = open("verifying_key.ecdsa-NIST256p", "wb")
f.write(sk.verifying_key.to_pem())
f.close()