# Signatures

- install python
- install module ecdsa:
```shell
python -m pip install ecdsa
```
- generate keys
```shell
python generate-keys.py
```
- sign and verify
```shell
ts-node sign-and-verify-identifier.ts
```
- if everything works as expected, no input. otherwise, something like:
```
ecdsa.errors.MalformedPointError: Point does not lay on the curve
```
