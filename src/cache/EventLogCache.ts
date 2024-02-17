import NodeCache from "node-cache";
import StaticComponent from "../lib/StaticComponent";
import {EventLog} from "../types/blockchain";

class EventLogCache extends StaticComponent {
  static cache: NodeCache = new NodeCache();

  static set(blockNumber: number, logIndex: number, log: EventLog): boolean {
    return this.cache.set(this.getKeyForLog(blockNumber, logIndex), log);
  }

  static get(blockNumber: number, logIndex: number): EventLog | undefined {
    return this.cache.get(this.getKeyForLog(blockNumber, logIndex));
  }

  static getForKey(key: string): EventLog | undefined {
    return this.cache.get(key);
  }

  static flushAll(): void {
    this.cache.flushAll();
  }

  static getKeyForLog(blockNumber: number, logIndex: number): string {
    return `${blockNumber}:${logIndex}`;
  }

  static has(blockNumber: number, logIndex: number): boolean {
    return this.cache.has(this.getKeyForLog(blockNumber, logIndex));
  }

  static keys(): string[] {
    return this.cache.keys();
  }

  static cleanCache(_blockNumber: number): number {
    const keys: string[] = this.cache.keys();
    const deleteKeys: string[] = [];

    for(const key of keys) {
      const [
        blockNumber,
        logIndex
      ] = key.split(':');

      if(parseInt(blockNumber) <= _blockNumber) {
        deleteKeys.push(key);
      }
    }

    return this.cache.del(deleteKeys.slice());
  }

  static getHighestLogIndexForBlock(blockNumber: number): number | undefined {
    let highestLogIndex: number | undefined = undefined;

    const keys: string[] = this.cache.keys().filter(_key => {
      return parseInt(_key.split(':')[0]) === blockNumber;
    });

    if(!keys) {
      this.debug(`No logs found for block ${blockNumber}`);
      return highestLogIndex;
    }

    return Math.max(
      ...(
        keys.map(_key => {
          return parseInt(_key.split(':')[1]);
        })
      )
    );
  }

  static getAllKeysForBlock(_blockNumber: number): string[] {
    const keys: string[] = this.cache.keys();
    const returnKeys: string[] = [];

    for(const key of keys) {
      const [
        blockNumber,
        logIndex
      ] = key.split(':');

      if(parseInt(blockNumber) === _blockNumber) {
        returnKeys.push(key);
      }
    }

    return returnKeys.slice();
  }
}

export default EventLogCache;