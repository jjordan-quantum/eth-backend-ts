import StaticComponent from "../../lib/StaticComponent";
import {Receipt} from "../../types/blockchain";
import {settings} from "../../config/settings";
import BlockchainClient from "../../lib/BlockchainClient";
import {sleep} from "set-interval-non-concurrent";
import {Client} from "../../Client";
import BlockTxnCache from "../../cache/BlockTxnCache";
import BlockTransactionsFetcher from "./BlockTransactionsFetcher";
import ReceiptCache from "../../cache/ReceiptCache";

export type ReceiptFetcherResult = {
  success: boolean,
  message?: string,
  error?: any,
  hash: string,
  receipt?: Receipt,
}

class ReceiptsFetcher extends StaticComponent {
  static retries: number = settings.receiptFetcherMaxRetries;
  static timeout: number = settings.receiptFetcherRetryTimeoutMs;

  static async apply(
    blockNumber: number,
    transactionHashes: string[] | undefined,
  ): Promise<boolean> {
    try {
      const start = Date.now();

      if(!transactionHashes) {
        this.log(`Transaction hashes undefined - fetching block`);

        const block = await BlockchainClient.getBlock(blockNumber, false);

        if(!block) {
          this.log(`Block undefined - cannot get receipts`);
          return false;
        }

        transactionHashes = block.transactions;
      }

      if(!transactionHashes) {
        this.log(`Transaction hashes undefined - aborting`);
        return false;
      }

      const receipts: Receipt[] = [];
      let i = 0;

      while(true) {
        const target: number = Math.min(
          i + settings.receiptFetcherMaxConcurrency,
          transactionHashes.length,
        );

        if(i >= target) {
          break;
        }

        const promises: Promise<ReceiptFetcherResult>[] = [];

        for(; i < target; i++) {
          promises.push(this.getTransactionReceipt(transactionHashes[i], 0));
        }

        await Promise.allSettled(promises);

        for(const promise of promises) {
          const {
            success,
            message,
            hash,
            error,
            receipt,
          } = await promise;

          if(!success) {
            this.error(`Failed to get receipt for ${hash}`, error);
          } else if(!receipt) {
            this.error(`Receipt undefined for ${hash}`, error);
          } else {
            receipts.push(receipt); // todo - destructure
          }
        }
      }

      this.log(`Fetched: ${receipts.length} receipts for block ${blockNumber} in ${Date.now() - start}ms`);

      // todo - check if all receipts were fetched

      Client.stream.emit('receipts', receipts.map(r => ({
        ...r,
        logs: r.logs ? r.logs.map(log => ({
          ...log,
          topics: log.topics ? log.topics.slice() : undefined,
        })) : [],
      })));

      for(const receipt of receipts) {
        const {
          blockNumber,
          transactionHash,
        } = receipt;

        ReceiptCache.set(
          blockNumber,
          transactionHash,
          {
            ...receipt,
            logs: receipt.logs ? receipt.logs.map(log => ({
              ...log,
              topics: log.topics ? log.topics.slice() : undefined,
            })) : [],
          },
        );
      }

      return true;
    } catch(e: any) {
      this.error(`Error encountered fetching logs for block ${blockNumber}`, e);
      return false;
    }
  }

  static async getTransactionReceipt(
    hash: string,
    retries: number
  ): Promise<ReceiptFetcherResult> {
    try {
      const receipt: Receipt | undefined = await BlockchainClient.getTransactionReceipt(hash);

      if(receipt) {
        return {
          success: true,
          hash,
          receipt,
        }
      }

      if(retries >= this.retries) {
        this.error(`Receipt undefined in result from client for ${hash}`);

        return {
          success: false,
          hash,
          message: 'receipt undefined',
        }
      }

      this.warn(`Receipt undefined in result from client for ${hash} - retrying`);
      await sleep(this.timeout);

      return await this.getTransactionReceipt(
        hash,
        retries + 1,
      );
    } catch(e) {
      if(retries >= this.retries) {
        this.error(`Encountered error fetching receipt for ${hash}`);

        return {
          success: false,
          hash,
          error: e,
          message: 'encountered error',
        }
      }

      this.error(`Encountered error fetching receipt for ${hash} - retrying`);
      await sleep(this.timeout);

      return await this.getTransactionReceipt(
        hash,
        retries + 1,
      );
    }
  }
}

export default ReceiptsFetcher;
