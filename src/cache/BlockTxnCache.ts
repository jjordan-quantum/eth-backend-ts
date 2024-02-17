import NodeCache from "node-cache";
import StaticComponent from "../lib/StaticComponent";
import {Transaction} from "../types/blockchain";

class BlockTxnCache extends StaticComponent {
  static cache: NodeCache = new NodeCache();

  static set(
    blockNumber: number,
    hash: string,
    tx: Transaction
  ): boolean {
    return this.cache.set(this.getKey(
      blockNumber,
      hash,
    ), {...tx});
  }

  static get(
    blockNumber: number,
    hash: string,
  ): Transaction | undefined {
    return this.cache.get(this.getKey(
      blockNumber,
      hash,
    ));
  }

  static getByHash(_hash: string): Transaction | undefined {
    const keys: string[] = this.cache.keys();

    for(const key of keys) {
      const [
        blockNumber,
        hash,
      ] = key.split(':');

      if(_hash === hash) {
        const tx: Transaction | undefined = this.get(
          parseInt(blockNumber),
          hash,
        );

        if(tx) {
          return {...tx};
        }
      }
    }

    return undefined;
  }

  static has(
    blockNumber: number,
    hash: string,
  ): boolean {
    return this.cache.has(this.getKey(
      blockNumber,
      hash,
    ));
  }

  static flushAll(): void {
    this.cache.flushAll();
  }

  static keys(): string[] {
    return this.cache.keys();
  }

  static getKey(
    blockNumber: number,
    hash: string,
  ): string {
    return `${blockNumber}:${hash}`;
  }

  static getAllKeysForBlock(_blockNumber: number): string[] {
    const keys: string[] = this.cache.keys();
    const returnKeys: string[] = [];

    for(const key of keys) {
      const [
        blockNumber,
        hash,
      ] = key.split(':');

      if(parseInt(blockNumber) === _blockNumber) {
        returnKeys.push(key);
      }
    }

    return returnKeys.slice();
  }

  static clearCacheForBlock(blockNumber: number): number {
    const keys: string[] = this.cache.keys();
    const deleteKeys: string[] = [];

    for(const key of keys) {
      const [_blockNumber, hash] = key.split(':');

      if(parseInt(_blockNumber) <= blockNumber) {
        deleteKeys.push(key);
      }
    }

    return this.cache.del(deleteKeys.slice());
  }
}

export default BlockTxnCache;
