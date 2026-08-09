export interface WireGuardPeer {
  publicKey: string;
  endpoint: string;
  allowedIps: string[];
  presharedKey?: string;
  persistentKeepalive?: number;
}

export interface WireGuardConfigInput {
  privateKeyRef: string;
  address: string;
  dns?: string[];
  mtu?: number;
  peer: WireGuardPeer;
}

export interface L4AdapterResult {
  adapter: "wireguard";
  config: string;
  executable: false;
  reason: "CONFIG_ONLY_NO_PRIVILEGE_ESCALATION";
}

/**
 * L4 WireGuard substrate adapter.
 *
 * Deliberately generates configuration only. It does not invoke wg, wg-quick,
 * netlink, iproute2, or alter host routing. Activation belongs to an explicit
 * privileged executor behind Gate 5410.
 */
export class WireGuardAdapter {
  render(input: WireGuardConfigInput): L4AdapterResult {
    this.validate(input);
    const lines = [
      "[Interface]",
      `PrivateKey = ${input.privateKeyRef}`,
      `Address = ${input.address}`,
      ...(input.dns?.length ? [`DNS = ${input.dns.join(", ")}`] : []),
      ...(input.mtu ? [`MTU = ${input.mtu}`] : []),
      "",
      "[Peer]",
      `PublicKey = ${input.peer.publicKey}`,
      `Endpoint = ${input.peer.endpoint}`,
      `AllowedIPs = ${input.peer.allowedIps.join(", ")}`,
      ...(input.peer.presharedKey ? [`PresharedKey = ${input.peer.presharedKey}`] : []),
      ...(input.peer.persistentKeepalive !== undefined
        ? [`PersistentKeepalive = ${input.peer.persistentKeepalive}`]
        : [])
    ];
    return {
      adapter: "wireguard",
      config: lines.join("\n") + "\n",
      executable: false,
      reason: "CONFIG_ONLY_NO_PRIVILEGE_ESCALATION"
    };
  }

  private validate(input: WireGuardConfigInput): void {
    if (!input.privateKeyRef.trim()) throw new Error("WIREGUARD_PRIVATE_KEY_REF_REQUIRED");
    if (!input.address.includes("/")) throw new Error("WIREGUARD_ADDRESS_MUST_BE_CIDR");
    if (!input.peer.publicKey.trim()) throw new Error("WIREGUARD_PEER_PUBLIC_KEY_REQUIRED");
    if (!input.peer.endpoint.includes(":")) throw new Error("WIREGUARD_ENDPOINT_MUST_INCLUDE_PORT");
    if (input.peer.allowedIps.length === 0) throw new Error("WIREGUARD_ALLOWED_IPS_REQUIRED");
    if (input.peer.persistentKeepalive !== undefined &&
        (!Number.isInteger(input.peer.persistentKeepalive) || input.peer.persistentKeepalive < 0)) {
      throw new Error("WIREGUARD_INVALID_KEEPALIVE");
    }
  }
}
