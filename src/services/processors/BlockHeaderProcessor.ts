import StaticComponent from "../../lib/StaticComponent";
import {settings} from "../../config/settings";
import BlockTransactionsFetcher from "../fetchers/BlockTransactionsFetcher";
import LogsFetcher from "../fetchers/LogsFetcher";
import ReceiptsFetcher from "../fetchers/ReceiptsFetcher";
import {CacheCleaner} from "../cache/CacheCleaner";
import BlockHeaderCache from "../../cache/BlockHeaderCache";
import BlockTxnCache from "../../cache/BlockTxnCache";
import ReceiptCache from "../../cache/ReceiptCache";
import EventLogCache from "../../cache/EventLogCache";
import EventLogsFilter from "../filters/EventLogsFilter";
import TransferEventCache from "../../cache/TransferEventCache";

export class BlockHeaderProcessor extends StaticComponent {
  static async apply(
    block: any,
    blockNumber: number,
    timestamp: number,
  ): Promise<void> {
    try {
      const start = Date.now();
      let blockTransactionHashes: string[] | undefined = undefined;
      let blockLogsPromise: Promise<any> | undefined = undefined;
      let blockReceiptsPromise: Promise<any> | undefined = undefined;

      // get block logs -> erc20 transfers -> nft transfers
      if(settings.streamBlockLogs) {
        blockLogsPromise = LogsFetcher.apply(blockNumber, 0);
      }

      // get block txns
      if(settings.streamBlockTransactions) {
        blockTransactionHashes = await BlockTransactionsFetcher.apply(blockNumber, 0);
      }

      // get block receipts
      if(settings.streamBlockReceipts) {
        blockReceiptsPromise = ReceiptsFetcher.apply(blockNumber, blockTransactionHashes);
      }

      const blockLogsResult: boolean = !!blockLogsPromise ? (await blockLogsPromise) : false;
      const blockReceiptsResult: boolean = !!blockReceiptsPromise ? (await blockReceiptsPromise) : false;

      if(settings.streamBlockTransactions) {
        // todo - confirm success
      }

      if(settings.streamBlockLogs) {
        // todo - confirm success -> check receipts
        // todo - filter transfers
      }

      if(settings.streamBlockReceipts) {
        // todo - confirm success
      }

      if(settings.streamBlockErc20Transfers) {
        EventLogsFilter.apply(blockNumber);
      }

      const end = Date.now();
      this.log(`Finished processing block ${blockNumber} in ${end - start}ms`);
      CacheCleaner.apply(blockNumber);
      this.log(`Cache cleared in ${Date.now() - end}ms - new totals: blocks=${BlockHeaderCache.keys().length} txns=${BlockTxnCache.keys().length} receipts=${ReceiptCache.keys().length} logs=${EventLogCache.keys().length} transfers=${TransferEventCache.keys().length}`);
    } catch(e) {
      this.error(`Error processing block header for block ${blockNumber}`, e);
    }
  }
}
