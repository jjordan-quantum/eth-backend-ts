import StaticComponent from "../../lib/StaticComponent";
import BlockchainClient from "../../lib/BlockchainClient";
import {Client} from "../../Client";
import {settings} from "../../config/settings";
import {sleep} from "set-interval-non-concurrent";
import BlockTxnCache from "../../cache/BlockTxnCache";

class BlockTransactionsFetcher extends StaticComponent {
  static retries: number = settings.transactionsFetcherMaxRetries;
  static timeout: number = settings.transactionsFetcherRetryTimeoutMs;

  static async apply(blockNumber: number, retries: number): Promise<string[] | undefined> {
    try {
      const start = Date.now();
      const transactions = await BlockchainClient.getBlockTransactions(blockNumber);

      if(transactions) {
        this.log(`Fetched: ${transactions.length} transactions for block ${blockNumber} in ${Date.now() - start}ms`);
        Client.stream.emit('transactions', transactions.map(t => ({...t})));

        for(const tx of transactions) {
          const {
            blockNumber,
            hash,
          } = tx;

          BlockTxnCache.set(
            blockNumber,
            hash,
            {...tx},
          );
        }

        return transactions.map(t => t.hash);
      }

      if(retries >= this.retries) {
        this.error(`Transactions undefined in result from client for block ${blockNumber}`);
        return undefined;
      }

      this.warn(`Transactions undefined in result from client for block ${blockNumber} - retrying`);
      await sleep(this.timeout);
      return await this.apply(blockNumber, retries + 1);
    } catch(e) {
      if(retries >= this.retries) {
        this.error(`Error encountered fetching block transactions for block ${blockNumber}`, e);
        return undefined;
      }

      this.error(`Error encountered fetching block transactions for block ${blockNumber} - retrying`, e);
      await sleep(this.timeout);
      return await this.apply(blockNumber, retries + 1);
    }
  }
}

export default BlockTransactionsFetcher;
