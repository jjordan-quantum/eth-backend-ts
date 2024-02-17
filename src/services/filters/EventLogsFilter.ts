import EventLogCache from "../../cache/EventLogCache";
import {EventLog} from "../../types/blockchain";
import {TRANSFER_EVENT_SIGNATURE} from "../../types/constants";
import BigNumber from "bignumber.js";
import TransferEventCache, {TransferEventSchema} from "../../cache/TransferEventCache";
import StaticComponent from "../../lib/StaticComponent";
import {Client} from "../../Client";

class EventLogsFilter extends StaticComponent {
  static apply(_blockNumber: number): void {
    try {
      const keys: string[] = EventLogCache.getAllKeysForBlock(_blockNumber);
      let totalTransfers: number = 0;
      this.log(`Filtering ${keys.length} event logs`);
      const transfers: TransferEventSchema[] = [];

      for(const key of keys) {
        const [
          blockNumber,
          logIndex,
        ] = key.split(':');

        const log: EventLog | undefined = EventLogCache.get(
          parseInt(blockNumber),
          parseInt(logIndex),
        );

        if(!log) {
          continue;
        }

        const {
          topics,
          transactionHash,
          address,
          data,
        } = log;

        if(!topics) { continue; }

        const [
          signature,
          from,
          to,
        ] = topics;

        if(!signature) { continue; }
        if(signature !== TRANSFER_EVENT_SIGNATURE) { continue; }
        if(!from) { continue; }
        if(!to) { continue; }
        if(!data) { continue; }
        totalTransfers++;

        // check addresses
        const sender: string = '0x' + from.slice(2).slice(24);
        const receiver: string = '0x' + to.slice(2).slice(24);
        const amount: string = new BigNumber(data).toFixed();

        const transfer: TransferEventSchema = {
          blockNumber: parseInt(blockNumber),
          hash: transactionHash,
          logIndex: parseInt(logIndex),
          asset: address,
          from: sender,
          to: receiver,
          amount,
        }

        // emit stream event
        transfers.push({...transfer});

        // cache transfer
        TransferEventCache.set(
          parseInt(blockNumber),
          parseInt(logIndex),
          transactionHash,
          {...transfer}
        );
      }

      if(transfers.length > 0) {
        Client.stream.emit('transfers', transfers.map(t => ({...t})));
      }

      this.log(`Filtered ${totalTransfers} total transfer events for block ${_blockNumber}`);
    } catch(e: any) {
      this.error(`Error encountered filtering logs`, e);
    }
  }
}

export default EventLogsFilter;