import {Client} from "./Client";
import {Logger} from "./lib/Logger";
import pino from "pino";

Client.start().catch(e => {
  Logger.error(`[App] Error encountered in global scope`, e);
});

// ===========================================================================
//
//  business logic goes here - example
//
// ===========================================================================

// custom logger for business logic

const logger = pino({
  level: 'info',
  transport: {
    target: 'pino-pretty',
    //level: logLevel,
    options: {
      colorize: true
    }
  }
});

Client.stream.on('block', (block) => {
  logger.info(`[Event] New block header event received: ${block.number}`);
});

Client.stream.on('transactions', (transactions) => {
  logger.info(`[Event] New block transactions event received with ${transactions.length} txns`);
});

Client.stream.on('logs', (logs) => {
  logger.info(`[Event] New logs for block event received with ${logs.length} logs`);
});

Client.stream.on('receipts', (receipts) => {
  logger.info(`[Event] New block receipts event received with ${receipts.length} receipts`);
});

Client.stream.on('log', (log) => {
  logger.info(`[Event] New logs event received`);
});

Client.stream.on('transfer', (transfer) => {
  logger.info(`[Event] New transfer event received`);
});

Client.stream.on('transfers', (transfers) => {
  logger.info(`[Event] New transfers for block event received with ${transfers.length} transfers`);
});
