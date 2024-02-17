import StaticComponent from "../../lib/StaticComponent";
import {settings} from "../../config/settings";
import {Client} from "../../Client";
import BlockHeaderCache from "../../cache/BlockHeaderCache";
import {BlockHeaderProcessor} from "../processors/BlockHeaderProcessor";
import BlockchainClient from "../../lib/BlockchainClient";
import EventLogCache from "../../cache/EventLogCache";
import LogProcessor from "../processors/LogProcessor";

class LogSubscription extends StaticComponent {
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

      this.subscription = BlockchainClient.websocketClient.eth.subscribe('logs', {})
        .on('connected', function(subscriptionId: string | undefined) {
          LogSubscription.subscriptionId = subscriptionId;
          LogSubscription.subscriptionStatus = true;
          LogSubscription.log(`Subscribed to logs with subscription id: ${subscriptionId}`);
        })
        .on('data', async function(log: any) {
          try {
            if(log) {
              const {
                blockNumber,
                logIndex,
                topics,
              } = log;

              const timestamp = Date.now();

              LogSubscription.log(`RECEIVED LOG AT ${logIndex} FOR BLOCK ${blockNumber} FROM SUBSCRIPTION @ ${timestamp}ms`);

              // emit event
              Client.stream.emit('log', {
                ...log,
                topics: topics ? topics.slice() : undefined,
              });

              LogProcessor.apply(
                blockNumber,
                logIndex,
                {
                  ...log,
                  topics: topics ? topics.slice() : undefined,
                }
              );
            } else {
              LogSubscription.error(`Log undefined`);
            }
          } catch(e) {
            LogSubscription.error(`Error processing log received in subscription`, e);
          }
        })
        .on('error', async function(error: any) {
          LogSubscription.error(`logs subscription encountered an error`, error);

          if(retries < maxSubscriptionReconnectTries) {
            setTimeout(function () {
              LogSubscription.subscribe(retries + 1);
            }, SUBSCRIBE_RETRY_DELAY_MILLISECONDS);
          } else {
            LogSubscription.subscriptionStatus = false;

            LogSubscription.error(
              `Failed to reconnect to logs subscription after ${maxSubscriptionReconnectTries} retries - waiting longer`,
              undefined
            );

            setTimeout(function () {
              LogSubscription.subscribe();
            }, subscribeLongPauseMs);
          }
        })
    } catch(e: any) {
      this.error(`Error subscribing to logs`, e);
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
            LogSubscription.log(`Successfully unsubscribed from block headers for subscription ${subscriptionHandle.id}`);
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

export default LogSubscription;
