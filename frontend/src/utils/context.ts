import { Namespace, createNamespace } from 'cls-hooked';
import { randomUUID } from 'crypto';

export interface ContextKeys {
  req: {
    method: string;
    host: string;
    originalUrl: string;
  };
  logger: {
    transactionId: string;
  };
}

export class ContextUtil {
  private static instance: ContextUtil;
  private readonly ns: Namespace;

  private constructor() {
    this.ns = createNamespace(randomUUID());
  }

  static getInstance() {
    if (!ContextUtil.instance) {
      ContextUtil.instance = new ContextUtil();
    }
    return ContextUtil.instance;
  }

  private existContext() {
    return this.ns && this.ns.active;
  }

  setContext<K extends keyof ContextKeys>(key: K, data: ContextKeys[K]) {
    if (this.existContext()) this.ns.set(key, data);
  }

  getContext<K extends keyof ContextKeys>(key: K): ContextKeys[K] | undefined {
    if (this.existContext()) return this.ns.get(key);
    return undefined;
  }

  runInNewContext(cb: () => void) {
    this.ns.run(() => {
      this.setContext('logger', { transactionId: randomUUID() });
      cb();
    });
  }
}
