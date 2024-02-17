import StaticComponent from "../../lib/StaticComponent";
import {EventLog} from "../../types/blockchain";
import BlockchainClient from "../../lib/BlockchainClient";
import {Client} from "../../Client";
import {settings} from "../../config/settings";
import {sleep} from "set-interval-non-concurrent";
import EventLogCache from "../../cache/EventLogCache";


class LogsFetcher extends StaticComponent {
  static retries: number = settings.logsFetcherMaxRetries;
  static timeout: number = settings.logsFetcherRetryTimeoutMs;

  static async apply(blockNumber: number, retries: number): Promise<boolean> {
    try {
      const start = Date.now();
      const logs: EventLog[] | undefined = await BlockchainClient.getPastLogs(blockNumber);

      if(logs) {
        this.log(`Fetched: ${logs.length} logs for block ${blockNumber} in ${Date.now() - start}ms`);

        Client.stream.emit('logs', logs.map(log => ({
          ...log,
          topics: log.topics ? log.topics.slice() : undefined,
        })));

        for(const log of logs) {
          const {
            blockNumber,
            logIndex,
            topics
          } = log;

          EventLogCache.set(
            blockNumber,
            logIndex,
            {
              ...log,
              topics: topics ? topics.slice() : undefined,
            }
          );
        }

        return true;
      }

      if(retries >= this.retries) {
        this.error(`Logs undefined in result from client for block ${blockNumber}`);
        return false;
      }

      this.warn(`Logs undefined in result from client for block ${blockNumber} - retrying`);
      await sleep(this.timeout);
      return await this.apply(blockNumber, retries + 1);
    } catch(e) {
      if(retries >= this.retries) {
        this.error(`Error encountered fetching logs for block ${blockNumber}`, e);
        return false;
      }

      this.error(`Error encountered fetching logs for block ${blockNumber} - retrying`, e);
      await sleep(this.timeout);
      return await this.apply(blockNumber, retries + 1);
    }
  }
}

export default LogsFetcher;
