import StaticComponent from "../../lib/StaticComponent";
import BlockHeaderCache from "../../cache/BlockHeaderCache";
import {settings} from "../../config/settings";
import BlockTxnCache from "../../cache/BlockTxnCache";
import EventLogCache from "../../cache/EventLogCache";
import ReceiptCache from "../../cache/ReceiptCache";
import TransferEventCache from "../../cache/TransferEventCache";

export class CacheCleaner extends StaticComponent {
  static maxBlocksInCache: number = settings.maxBlocksInCache;

  static apply(blockNumber: number): void {
    try {
      BlockHeaderCache.clearCacheForBlock(blockNumber - this.maxBlocksInCache);
      BlockTxnCache.clearCacheForBlock(blockNumber - this.maxBlocksInCache);
      EventLogCache.cleanCache(blockNumber - this.maxBlocksInCache);
      ReceiptCache.clearCacheForBlock(blockNumber - this.maxBlocksInCache);
      TransferEventCache.clearCacheForBlock(blockNumber - this.maxBlocksInCache);
    } catch(e) {
      this.error(`Error trying to clean cache for block ${blockNumber}`, e);
    }
  }
}
