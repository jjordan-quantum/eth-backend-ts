import {config} from "dotenv";
import {getRandom} from "../utils/getRandom";
import {LOG_LEVELS} from "../types/constants";
config();

export type Settings = {
  logToFile: boolean,
  logFilePath: string,
  logFileName: string,
  disableLoggingForServices: boolean,
  logLevelForService: string,
  websocketUrl: string;
  jsonRpcUrl: string;
  chainId: number;
  websocketProviderOptions: any;
  maxSubscriptionReconnectTries: number;
  subscribeRetryDelayMs: number;
  subscribeLongPauseMs: number;
  telegramBotApiToken: string;
  telegramIssuesBotApiToken: string;
  getUpdatesIntervalMs: number;
  jobExecutionQueueIntervalMs: number;
  messageDispatchQueueIntervalMs: number;
  chatMessageTimeoutIntervalMs: number;
  logMemoryMetricsIntervalMs: number;
  groupAdmins: string[];
  botMode: string;
  tracingMode: string;
  maxWritePoolConnections: number;
  pgHost: string;
  pgPort: number;
  pgUser: string;
  pgPassword: string;
  pgDatabase: string;
  loggingMode: string;
  newRelicApiKey: string;
  newRelicApiKeyId: string;
  newRelicApiUrl: string;
  appName: string;
  //databaseUrl: string;
  appInstanceId: number;
  zapKey0: string;
  zapKey1: string;
  telegramBotMessagesApiUrl: string;
  telegramBotUpdatesApiUrl: string;
  botId: number;
  pendingMessageTtyMs: number;

  // data streams config
  streamBlockHeaders: boolean;
  streamBlockTransactions: boolean;
  streamBlockLogs: boolean;
  streamBlockReceipts: boolean;
  streamBlockErc20Transfers: boolean;
  streamBlockNftTransfers: boolean;
  streamLogs: boolean;
  streamErc20Transfers: boolean;
  streamNftTransfers: boolean;
  streamPendingTransactionHashes: boolean;
  streamPendingTransactions: boolean;

  // fetcher settings
  receiptFetcherMaxConcurrency: number;
  receiptFetcherRetryTimeoutMs: number;
  receiptFetcherMaxRetries: number;
  transactionsFetcherRetryTimeoutMs: number;
  transactionsFetcherMaxRetries: number;
  logsFetcherRetryTimeoutMs: number;
  logsFetcherMaxRetries: number;

  // filter settings

  // cache
  maxBlocksInCache: number;

  // metrics
  logResourceMetricsIntervalMs: number;
}

export const settings: Settings = {
  logToFile: (process.env.LOG_TO_FILE || '').toLowerCase() === 'true' || false,
  logFilePath: process.env.LOG_FILE_PATH || 'logs',
  logFileName: process.env.LOG_FILE_NAME || 'debug.log',
  disableLoggingForServices: (process.env.DISABLE_LOGGING_FOR_SERVICES || '').toLowerCase() === 'true' || false,
  logLevelForService: (!!process.env.LOG_LEVEL_FOR_SERVICES && LOG_LEVELS.includes(process.env.LOG_LEVEL_FOR_SERVICES))
    ? (process.env.LOG_LEVEL_FOR_SERVICES)
    : 'info',
  websocketUrl: process.env.WEBSOCKET_URL as string,
  jsonRpcUrl: process.env.JSON_RPC_URL as string,
  chainId: parseInt(process.env.CHAIN_ID as string),
  maxSubscriptionReconnectTries: parseInt(process.env.MAX_SUBSCRIPTION_RECONNECT_TRIES as string),
  subscribeRetryDelayMs: parseInt(process.env.SUBSCRIBE_RETRY_DELAY_MS as string),
  subscribeLongPauseMs: parseInt(process.env.SUBSCRIBE_LONG_PAUSE_MS as string),
  telegramBotApiToken: process.env.TELEGRAM_BOT_API_TOKEN as string,
  telegramIssuesBotApiToken: process.env.TELEGRAM_ISSUES_BOT_API_TOKEN as string,
  getUpdatesIntervalMs: parseInt(process.env.GET_UPDATES_INTERVAL_MS as string),
  jobExecutionQueueIntervalMs: parseInt(process.env.JOB_EXECUTION_QUEUE_INTERVAL_MS as string),
  messageDispatchQueueIntervalMs: parseInt(process.env.MESSAGE_DISPATCH_QUEUE_INTERVAL_MS as string),
  chatMessageTimeoutIntervalMs: parseInt(process.env.CHAT_MESSAGE_TIMEOUT_INTERVAL_MS as string),
  logMemoryMetricsIntervalMs: parseInt(process.env.LOG_MEMORY_METRICS_INTERVAL_MS as string),
  websocketProviderOptions: {
    // Useful if requests result are large
    clientConfig: {
      maxReceivedFrameSize: 10000000,   // bytes - default: 1MiB
      maxReceivedMessageSize: 10000000, // bytes - default: 8MiB
    },

    // Enable auto reconnection
    reconnect: {
      auto: true,
      delay: 1000, // ms
      maxAttempts: 20,
      onTimeout: false
    }
  },
  groupAdmins: [
    'jayjorgen',
    process.env.GROUP_USER_1 || 'LikeAStar',  // LikeAStar?
  ],
  botMode: process.env.BOT_MODE || 'prod',
  tracingMode: process.env.TRACING_MODE || 'disabled',
  maxWritePoolConnections: parseInt(process.env.MAX_WRITE_POOL_CONNECTIONS || '10'),
  pgHost: process.env.PG_HOST as string,
  pgPort: parseInt(process.env.PG_PORT || '5432'),
  pgUser: process.env.PG_USER as string,
  pgPassword: process.env.PG_PASSWORD as string,
  pgDatabase: process.env.PG_DATABASE as string,
  loggingMode: process.env.LOGGING_MODE || 'file',
  newRelicApiKey: process.env.NEW_RELIC_API_KEY as string,
  newRelicApiKeyId: process.env.NEW_RELIC_API_KEY_ID as string,
  newRelicApiUrl: process.env.NEW_RELIC_API_URL as string,
  appName: process.env.APP_NAME as string,
  //databaseUrl: process.env.DATABASE_URL as string,
  appInstanceId: getRandom(),
  zapKey0: process.env.ZAP_HOOK_KEY_0 as string,
  zapKey1: process.env.ZAP_HOOK_KEY_1 as string,
  telegramBotMessagesApiUrl: process.env.TELEGRAM_BOT_MESSAGES_API_URL as string,
  telegramBotUpdatesApiUrl: process.env.TELEGRAM_BOT_UPDATES_API_URL as string,
  botId: parseInt(process.env.BOT_ID as string),
  // pendingMessageTtyMs: parseInt(process.env.PENDING_MESSAGE_TTY_MS || '60000'),
  pendingMessageTtyMs: 30000,

  streamBlockHeaders: (process.env.STREAM_BLOCK_HEADERS || '').toLowerCase() === 'true' || false,
  streamBlockTransactions: (process.env.STREAM_BLOCK_TRANSACTIONS || '').toLowerCase() === 'true' || false,
  streamBlockLogs: (process.env.STREAM_BLOCK_LOGS || '').toLowerCase() === 'true' || false,
  streamBlockReceipts: (process.env.STREAM_BLOCK_RECEIPTS || '').toLowerCase() === 'true' || false,
  streamBlockErc20Transfers: (process.env.STREAM_BLOCK_ERC20_TRANSFERS || '').toLowerCase() === 'true' || false,
  streamBlockNftTransfers: (process.env.STREAM_BLOCK_NFT_TRANSFERS || '').toLowerCase() === 'true' || false,
  streamLogs: (process.env.STREAM_LOGS || '').toLowerCase() === 'true' || false,
  streamErc20Transfers: (process.env.STREAM_ERC20_TRANSFERS || '').toLowerCase() === 'true' || false,
  streamNftTransfers: (process.env.STREAM_NFT_TRANSFERS || '').toLowerCase() === 'true' || false,
  streamPendingTransactionHashes: (process.env.STREAM_PENDING_TRANSACTION_HASHES || '').toLowerCase() === 'true' || false,
  streamPendingTransactions: (process.env.STREAM_PENDING_TRANSACTIONS || '').toLowerCase() === 'true' || false,

  receiptFetcherMaxConcurrency: parseInt(process.env.RECEIPT_FETCHER_MAX_CONCURRENCY || '10'),
  receiptFetcherRetryTimeoutMs: parseInt(process.env.RECEIPT_FETCHER_RETRY_TIMEOUT_MS || '100'),
  receiptFetcherMaxRetries: parseInt(process.env.RECEIPT_FETCHER_MAX_RETRIES || '1'),

  transactionsFetcherRetryTimeoutMs: parseInt(process.env.TRANSACTIONS_FETCHER_RETRY_TIMEOUT_MS || '100'),
  transactionsFetcherMaxRetries: parseInt(process.env.TRANSACTIONS_FETCHER_MAX_RETRIES || '1'),

  logsFetcherRetryTimeoutMs: parseInt(process.env.LOGS_FETCHER_RETRY_TIMEOUT_MS || '100'),
  logsFetcherMaxRetries: parseInt(process.env.LOGS_FETCHER_MAX_RETRIES || '1'),

  maxBlocksInCache: parseInt(process.env.MAX_BLOCKS_IN_CACHE || '50'),

  logResourceMetricsIntervalMs: parseInt(process.env.LOG_RESOURCE_METRICS_INTERVAL_MS || '60000'),
}