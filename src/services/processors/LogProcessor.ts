import StaticComponent from "../../lib/StaticComponent";
import {EventLog} from "../../types/blockchain";
import EventLogCache from "../../cache/EventLogCache";
import {settings} from "../../config/settings";
import EventLogFilter from "../filters/EventLogFilter";

class LogProcessor extends StaticComponent {
  static apply(
    blockNumber: number,
    logIndex: number,
    log: EventLog,
  ): void {
    try {
      EventLogCache.set(
        blockNumber,
        logIndex,
        {
          ...log,
          topics: log.topics ? log.topics.slice() : undefined,
        }
      );

      if(settings.streamErc20Transfers) {
        EventLogFilter.apply(
          blockNumber,
          logIndex,
          {
            ...log,
            topics: log.topics ? log.topics.slice() : undefined,
          }
        );
      }
    } catch(e) {
      this.error(`Error processing log at ${logIndex} for ${blockNumber}`, e);
    }
  }
}

export default LogProcessor;
