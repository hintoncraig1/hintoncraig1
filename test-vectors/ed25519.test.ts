import { createPrivateKey, createPublicKey, sign, verify } from "node:crypto";
import { test } from "node:test";
import assert from "node:assert/strict";
import { ED25519_VECTORS } from "./ed25519.vectors";

function privateKeyFromSeed(seedHex: string) {
  const seed = Buffer.from(seedHex, "hex");
  // PKCS#8 wrapper for a raw Ed25519 seed (RFC 8410).
  const der = Buffer.concat([
    Buffer.from("302e020100300506032b657004220420", "hex"),
    seed
  ]);
  return createPrivateKey({ key: der, format: "der", type: "pkcs8" });
}

function publicKeyFromRaw(rawHex: string) {
  const raw = Buffer.from(rawHex, "hex");
  const der = Buffer.concat([
    Buffer.from("302a300506032b6570032100", "hex"),
    raw
  ]);
  return createPublicKey({ key: der, format: "der", type: "spki" });
}

test("Ed25519 RFC 8032 fixtures verify exactly", () => {
  for (const vector of ED25519_VECTORS) {
    const publicKey = publicKeyFromRaw(vector.publicKeyHex);
    const message = Buffer.from(vector.messageHex, "hex");
    const signature = Buffer.from(vector.signatureHex, "hex");
    assert.equal(verify(null, message, publicKey, signature), true, vector.id);
  }
});

test("Ed25519 signing reproduces the canonical signatures", () => {
  for (const vector of ED25519_VECTORS) {
    const privateKey = privateKeyFromSeed(vector.secretKeyHex);
    const message = Buffer.from(vector.messageHex, "hex");
    const actual = sign(null, message, privateKey).toString("hex");
    assert.equal(actual, vector.signatureHex, vector.id);
  }
});

test("Ed25519 fixtures reject a one-byte mutation", () => {
  for (const vector of ED25519_VECTORS) {
    const publicKey = publicKeyFromRaw(vector.publicKeyHex);
    const message = Buffer.from(vector.messageHex, "hex");
    const signature = Buffer.from(vector.signatureHex, "hex");
    const mutated = Buffer.from(signature);
    mutated[0] ^= 0x01;
    assert.equal(verify(null, message, publicKey, mutated), false, vector.id);
  }
});
