# Atrium L4 Adapters + Ed25519 Test Vectors

This module adds a deterministic cryptographic fixture suite and two deliberately separated L4 substrates.

## Ed25519

`test-vectors/ed25519.vectors.ts` contains RFC 8032 §7.1 Ed25519 fixtures. The tests verify:

- canonical signature verification;
- deterministic signing against the published signatures;
- rejection after a one-bit signature mutation.

The fixture seeds are public test vectors only and MUST NOT be reused as production credentials.

## L4 substrates

- `LoopbackAdapter` binds only to `127.0.0.0/8` and provides a byte round-trip test. It has no public listener or routing side effect.
- `WireGuardAdapter` renders a validated WireGuard configuration but deliberately does not execute `wg`, `wg-quick`, netlink, `ip`, or privileged commands. Activation remains an explicit Gate 5410-controlled operation.

This keeps the control plane separate from the data-plane substrate: policy decides; the adapter translates; a separate privileged executor, when explicitly authorized, performs host mutation.

## Verification

From a Node/TypeScript development environment:

```bash
npm install
npm test
```

The connected GitHub operation creates the source artifacts and commit; it does not claim that the tests were executed in this chat environment.
