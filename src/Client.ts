import BlockchainClient from "./lib/BlockchainClient";
import {Logger} from "./lib/Logger";
import EventEmitter from "events";
import {setIntervalNoConcurrency} from "set-interval-non-concurrent";
import {settings} from "./config/settings";
import MemoryMetrics from "./services/metrics/MemoryMetrics";
import LogRotator from "./lib/LogRotator";

export class Client {
  static stream: EventEmitter = new EventEmitter();

  static async start(): Promise<void> {
    setIntervalNoConcurrency(() => {
      Logger.info(`[Metrics] ${MemoryMetrics.getMemoryUsageFormatted()}`);
    }, settings.logResourceMetricsIntervalMs)

    while(true) {
      try {
        await BlockchainClient.initialize();
        break
      } catch(e: any) {
        Logger.error('[App] Error encountered initializing BlockchainClient', e);
      }

      await(60*1000);
    }

    BlockchainClient.start();
    LogRotator.start();
  }
}
