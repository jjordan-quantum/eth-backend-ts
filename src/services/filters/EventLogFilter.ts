import StaticComponent from "../../lib/StaticComponent";
import {EventLog} from "../../types/blockchain";
import {TRANSFER_EVENT_SIGNATURE} from "../../types/constants";
import BigNumber from "bignumber.js";
import TransferEventCache, {TransferEventSchema} from "../../cache/TransferEventCache";
import {Client} from "../../Client";

class EventLogFilter extends StaticComponent {
  static apply(
    blockNumber: number,
    logIndex: number,
    log: EventLog,
  ): void {
    try {
      const {
        topics,
        transactionHash,
        address,
        data,
      } = log;

      if(!topics) { return; }

      const [
        signature,
        from,
        to,
      ] = topics;

      if(!signature) { return; }
      if(signature !== TRANSFER_EVENT_SIGNATURE) { return; }
      if(!from) { return; }
      if(!to) { return; }
      if(!data) { return; }

      // check addresses
      const sender: string = '0x' + from.slice(2).slice(24);
      const receiver: string = '0x' + to.slice(2).slice(24);
      const amount: string = new BigNumber(data).toFixed();

      const transfer: TransferEventSchema = {
        blockNumber,
        hash: transactionHash,
        logIndex,
        asset: address,
        from: sender,
        to: receiver,
        amount,
      }

      // emit stream event
      Client.stream.emit('transfer', {...transfer});

      // cache transfer
      TransferEventCache.set(
        blockNumber,
        logIndex,
        transactionHash,
        {...transfer},
      );
    } catch(e) {
      this.error(`Error filtering log at ${logIndex} for block ${blockNumber}`, e);
    }
  }
}

export default EventLogFilter;
