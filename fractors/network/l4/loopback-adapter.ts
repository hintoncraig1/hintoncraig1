import { createServer, connect, type Server, type Socket } from "node:net";

export interface LoopbackAdapterOptions {
  host?: string;
  port?: number;
}

export interface LoopbackEndpoint {
  host: string;
  port: number;
}

/**
 * L4 loopback substrate. Binds only to the local host; it never exposes a
 * public listener and contains no firewall/routing side effects.
 */
export class LoopbackAdapter {
  private readonly host: string;
  private readonly requestedPort: number;
  private server?: Server;
  private endpoint?: LoopbackEndpoint;

  constructor(options: LoopbackAdapterOptions = {}) {
    this.host = options.host ?? "127.0.0.1";
    this.requestedPort = options.port ?? 0;
    if (!/^127(?:\.\d{1,3}){3}$/.test(this.host) && this.host !== "localhost") {
      throw new Error("LOOPBACK_ADAPTER_REQUIRES_LOOPBACK_HOST");
    }
  }

  async listen(onConnection?: (socket: Socket) => void): Promise<LoopbackEndpoint> {
    if (this.server) throw new Error("LOOPBACK_ALREADY_LISTENING");
    const server = createServer(onConnection);
    await new Promise<void>((resolve, reject) => {
      server.once("error", reject);
      server.listen(this.requestedPort, this.host, () => {
        server.removeListener("error", reject);
        resolve();
      });
    });
    const address = server.address();
    if (!address || typeof address === "string") {
      server.close();
      throw new Error("LOOPBACK_ADDRESS_UNAVAILABLE");
    }
    this.server = server;
    this.endpoint = { host: this.host, port: address.port };
    return this.endpoint;
  }

  async probe(payload: Uint8Array): Promise<Uint8Array> {
    if (!this.endpoint) await this.listen(socket => socket.pipe(socket));
    const endpoint = this.endpoint!;
    return await new Promise<Uint8Array>((resolve, reject) => {
      const socket = connect(endpoint.port, endpoint.host);
      const chunks: Buffer[] = [];
      socket.on("data", chunk => chunks.push(Buffer.from(chunk)));
      socket.on("error", reject);
      socket.on("close", () => resolve(Buffer.concat(chunks)));
      socket.on("connect", () => socket.end(Buffer.from(payload)));
    });
  }

  async close(): Promise<void> {
    if (!this.server) return;
    const server = this.server;
    this.server = undefined;
    this.endpoint = undefined;
    await new Promise<void>((resolve, reject) => server.close(error => error ? reject(error) : resolve()));
  }

  getEndpoint(): LoopbackEndpoint | undefined {
    return this.endpoint;
  }
}
