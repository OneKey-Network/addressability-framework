import copy
from ecdsa import SigningKey, VerifyingKey, util
import hashlib 
import json

def main():
    sk = get_signing_key()
    id = get_identifier_to_sign()

    values = [
        id["source"]["domain"],
        str(id["source"]["timestamp"]),
        id["type"],
        id["value"]
    ]
    signed_str = '\u2063'.join(values)
    signed_bytes = bytearray(signed_str, 'utf-8')
    signature = sk.sign(signed_bytes, hashfunc = hashlib.sha256)

    vk = get_verifying_key()
    valid = vk.verify(signature, signed_bytes, hashfunc = hashlib.sha256)
    assert valid
    

def get_signing_key():
    with open("signing_key.ecdsa-NIST256p", "rb") as f:
        sk_pem = f.read()
        sk = SigningKey.from_pem(sk_pem)
        return sk

def get_verifying_key():
    with open("verifying_key.ecdsa-NIST256p", "rb") as f:
        sk_pem = f.read()
        sk = VerifyingKey.from_pem(sk_pem)
        return sk

def get_identifier_to_sign():
    with open("identifier.json", "r") as f:
        json_val = f.read()
        id = json.loads(json_val)
        return id

def flush_signed_identifier(id):
    json_val = json.dump(id, indent = 4)
    with open("signed_identifier.json", "w") as f:
        f.write(json_val)

if __name__ == "__main__":
    main()





  
