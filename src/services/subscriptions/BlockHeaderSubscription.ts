import StaticComponent from "../../lib/StaticComponent";
import {settings} from "../../config/settings";
import {Client} from "../../Client";
import BlockHeaderCache from "../../cache/BlockHeaderCache";
import {BlockHeaderProcessor} from "../processors/BlockHeaderProcessor";
import BlockchainClient from "../../lib/BlockchainClient";

class BlockHeaderSubscription extends StaticComponent {
  static subscriptionStatus: boolean = false;
  static subscription: any | undefined;
  static subscriptionId: string | undefined;

  static subscribe(
    retries: number = 0,
    recursiveReconnect: boolean = false
  ): void {
    try {
      this.unsubscribe();
      const maxSubscriptionReconnectTries = settings.maxSubscriptionReconnectTries;
      const SUBSCRIBE_RETRY_DELAY_MILLISECONDS = settings.subscribeRetryDelayMs;
      const subscribeLongPauseMs = settings.subscribeLongPauseMs;

      this.subscription = BlockchainClient.websocketClient.eth.subscribe('newBlockHeaders')
        .on('connected', function(subscriptionId: string | undefined) {
          BlockHeaderSubscription.subscriptionId = subscriptionId;
          BlockHeaderSubscription.subscriptionStatus = true;
          BlockHeaderSubscription.log(`Subscribed to new block headers with subscription id: ${subscriptionId}`);
        })
        .on('data', async function(block: any) {
          try {
            if(block) {
              //console.log(block);  // TODO - remove
              const blockNumber = block.number;
              const timestamp = Date.now();
              const age = timestamp - (block.timestamp * 1000);
              BlockHeaderSubscription.log(`RECEIVED BLOCK ${blockNumber} FROM SUBSCRIPTION @ ${timestamp}ms (AGE=${age}ms)`);
              BlockchainClient.highestBlockNumber = Math.max(blockNumber, BlockchainClient.highestBlockNumber);

              // emit event
              Client.stream.emit('block', {...block});
              BlockHeaderCache.set(blockNumber, {...block});

              BlockHeaderProcessor.apply(
                {...block},
                blockNumber,
                BlockchainClient.chainId,
              ).then();
            } else {
              BlockHeaderSubscription.error(`Block undefined`);
            }
          } catch(e) {
            BlockHeaderSubscription.error('Error processing block from subscription', e);
          }
        })
        .on('error', async function(error: any) {
          BlockHeaderSubscription.error(`newBlockHeader subscription encountered an error`, error);

          if(retries < maxSubscriptionReconnectTries) {
            setTimeout(function () {
              BlockHeaderSubscription.subscribe(retries + 1);
            }, SUBSCRIBE_RETRY_DELAY_MILLISECONDS);
          } else {
            BlockHeaderSubscription.subscriptionStatus = false;

            BlockHeaderSubscription.error(
              `Failed to reconnect to subscription after ${maxSubscriptionReconnectTries} retries - waiting longer`,
              undefined
            );

            setTimeout(function () {
              BlockHeaderSubscription.subscribe();
            }, subscribeLongPauseMs);
          }
        })
    } catch(e: any) {
      this.error(`Error subscribing to new block headers`, e);
    }
  }

  static unsubscribe(): void {
    try {
      const subscriptionHandle = this.subscription;
      this.subscription = undefined;

      if(subscriptionHandle) {
        this.log(`Unsubscribing from block headers from previous subscription ${subscriptionHandle.id}`);

        subscriptionHandle.unsubscribe(function(error: any, success: any){
          if(success) {
            BlockHeaderSubscription.log(`Successfully unsubscribed from block headers for subscription ${subscriptionHandle.id}`);
          }
        });
      } else {
        this.log(`No existing subscription found`);
      }
    } catch(e) {
      this.error(`Failed to unsubscribe from block headers`, e);
    }
  }
}

export default BlockHeaderSubscription;
