import NodeCache from "node-cache";
import StaticComponent from "../lib/StaticComponent";
import {BlockHeader} from "../types/blockchain";

class BlockHeaderCache extends StaticComponent {
  static cache: NodeCache = new NodeCache();

  static set(
    blockNumber: number,
    block: BlockHeader
  ): boolean {
    return this.cache.set(String(blockNumber), {...block});
  }

  static get(blockNumber: number): BlockHeader | undefined {
    return this.cache.get(String(blockNumber));
  }

  static has(
    blockNumber: number,
  ): boolean {
    return this.cache.has(String(blockNumber));
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

  static clearCacheForBlock(blockNumber: number): number {
    const keys: string[] = this.cache.keys();
    const deleteKeys: string[] = [];

    for(const _blockNumber of keys) {
      if(parseInt(_blockNumber) <= blockNumber) {
        deleteKeys.push(_blockNumber);
      }
    }

    return this.cache.del(deleteKeys.slice());
  }
}

export default BlockHeaderCache;
