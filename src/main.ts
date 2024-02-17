import {Client} from "./Client";
import {Logger} from "./lib/Logger";

Client.start().catch(e => {
  Logger.error(`[App] Error encountered in global scope`, e);
});

// ===========================================================================
//
//  business logic goes here - example
//
// ===========================================================================

Client.stream.on('block', (block) => {
  Logger.info(`[Event] New block header event received: ${block.number}`);
});

Client.stream.on('transactions', (transactions) => {
  Logger.info(`[Event] New block transactions event received`);
});

Client.stream.on('logs', (logs) => {
  Logger.info(`[Event] New block logs event received`);
});

Client.stream.on('receipts', (receipts) => {
  Logger.info(`[Event] New block receipts event received`);
});
