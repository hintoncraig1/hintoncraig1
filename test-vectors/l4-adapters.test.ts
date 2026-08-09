import { test } from "node:test";
import assert from "node:assert/strict";
import { LoopbackAdapter } from "../fractors/network/l4/loopback-adapter";
import { WireGuardAdapter } from "../fractors/network/l4/wireguard-adapter";

test("Loopback adapter stays on localhost and round-trips bytes", async () => {
  const adapter = new LoopbackAdapter({ host: "127.0.0.1", port: 0 });
  const endpoint = await adapter.listen(socket => socket.pipe(socket));
  assert.equal(endpoint.host, "127.0.0.1");
  assert.ok(endpoint.port > 0);
  const response = await adapter.probe(Buffer.from("atrium-l4"));
  assert.equal(response.toString(), "atrium-l4");
  await adapter.close();
});

test("Loopback adapter rejects non-loopback binding", () => {
  assert.throws(() => new LoopbackAdapter({ host: "0.0.0.0" }), /LOOPBACK_ADAPTER_REQUIRES_LOOPBACK_HOST/);
});

test("WireGuard adapter renders config without executing privileged operations", () => {
  const adapter = new WireGuardAdapter();
  const result = adapter.render({
    privateKeyRef: "<LOCAL_DEVICE_PRIVATE_KEY>",
    address: "10.8.0.2/24",
    dns: ["1.1.1.1"],
    peer: {
      publicKey: "PEER_PUBLIC_KEY",
      endpoint: "203.0.113.10:51820",
      allowedIps: ["10.8.0.0/24"],
      persistentKeepalive: 25
    }
  });

  assert.equal(result.executable, false);
  assert.match(result.config, /\[Interface\]/);
  assert.match(result.config, /\[Peer\]/);
  assert.match(result.config, /AllowedIPs = 10\.8\.0\.0\/24/);
});
