import StaticComponent from "../lib/StaticComponent";
import NodeCache from "node-cache";

export type TransferEventSchema = {
  blockNumber: number;
  hash: string;
  logIndex: number;
  asset: string;
  from: string;
  to: string;
  amount: string;
}

class TransferEventCache extends StaticComponent {
  static cache: NodeCache = new NodeCache();

  static set(
    blockNumber: number,
    logIndex: number,
    hash: string,
    transfer: TransferEventSchema
  ): boolean {
    return this.cache.set(this.getKey(
      blockNumber,
      logIndex,
      hash,
    ), {...transfer});
  }

  static get(
    blockNumber: number,
    logIndex: number,
    hash: string,
  ): TransferEventSchema | undefined {
    return this.cache.get(this.getKey(
      blockNumber,
      logIndex,
      hash,
    ));
  }

  static has(
    blockNumber: number,
    logIndex: number,
    hash: string,
  ): boolean {
    return this.cache.has(this.getKey(
      blockNumber,
      logIndex,
      hash,
    ));
  }

  static keys(): string[] {
    return this.cache.keys();
  }

  static getForKey(
    key: string,
  ): TransferEventSchema | undefined {
    return this.cache.get(key);
  }

  static getKey(
    blockNumber: number,
    logIndex: number,
    hash: string,
  ): string {
    return `${blockNumber}:${logIndex}:${hash}`;
  }

  static getAllKeysForHash(_hash: string): string[] {
    const keys: string[] = this.cache.keys();
    const returnKeys: string[] = [];

    for(const key of keys) {
      const [
        blockNumber,
        logIndex,
        hash,
      ] = key.split(':');

      if(_hash === hash) {
        returnKeys.push(key);
      }
    }

    return returnKeys.slice();
  }

  static getAllKeysForBlock(_blockNumber: number): string[] {
    const keys: string[] = this.cache.keys();
    const returnKeys: string[] = [];

    for(const key of keys) {
      const [
        blockNumber,
        logIndex,
        hash,
      ] = key.split(':');

      if(parseInt(blockNumber) === _blockNumber) {
        returnKeys.push(key);
      }
    }

    return returnKeys.slice();
  }

  static clearCacheForBlock(_blockNumber: number): number {
    const keys: string[] = this.cache.keys();
    const deleteKeys: string[] = [];

    for(const key of keys) {
      const [
        blockNumber,
        logIndex,
        hash,
      ] = key.split(':');

      if(parseInt(blockNumber) <= _blockNumber) {
        deleteKeys.push(key);
      }
    }

    return this.cache.del(deleteKeys.slice());
  }
}

export default TransferEventCache;
