export type PartialTransaction = {
  hash?: string;
  nonce?: number;
  blockHash?: string;
  blockNumber?: number;
  transactionIndex?: number;
  from: string;
  to: string | undefined;
  value: string | undefined;
  gas?: string;
  gasPrice?: string | undefined;
  input: string | undefined;
  maxFeePerGas?: string | undefined;
  maxPriorityFeePerGas?: string | undefined;
  r?: string;
  s?: string;
  v?: string;
  type?: number | string | undefined;
}

export type Transaction = {
  hash: string;
  nonce: number;
  blockHash: string;
  blockNumber: number;
  transactionIndex: number;
  from: string;
  to: string;
  value: string | bigint;
  gas: number | bigint;
  gasPrice: string | undefined;
  input: string | undefined;
  maxFeePerGas: string | undefined;
  maxPriorityFeePerGas: string | undefined;
  r: string;
  s: string;
  v: string;
  type: number | string | undefined;
}

export type PendingTransaction = {
  hash: string; //
  nonce: number; //
  blockHash: string | undefined;
  blockNumber: number | undefined;
  transactionIndex: number | undefined;
  from: string;  //
  to: string | undefined;  //
  value: string | undefined; //
  gas: string;  //
  gasPrice: string | undefined;  //
  input: string | undefined; //
  maxFeePerGas: string | undefined;  //
  maxPriorityFeePerGas: string | undefined;  //
  r: string;
  s: string;
  v: string;
  type: number | undefined;
}

export type EventLog = {
  address: string;
  topics: string[] | undefined;
  data: string | undefined;
  blockNumber: number;
  transactionHash: string;
  transactionIndex: number;
  blockHash: string;
  logIndex: number;
  removed: boolean;
  id: string | undefined;
}

export type Receipt = {
  blockHash: string;
  blockNumber: number;
  contractAddress: string | undefined;
  cumulativeGasUsed: number;
  effectiveGasPrice: number | bigint;
  from: string;
  gasUsed: number;
  logs: EventLog[];
  logsBloom: string;
  status: boolean | number;
  to: string | undefined;
  transactionHash: string;
  transactionIndex: number;
  type: string | number | undefined;
}

export type FullBlock = {
  number: number;
  nonce: string,
  gasUsed: number,
  gasLimit: number,
  transactionsRoot: string,
  receiptsRoot: string,
  stateRoot: string,
  transactions: Transaction[],
  hash: string,
  parentHash: string,
  difficulty: number,
  totalDifficulty: number,
  miner: string,
  sha3uncles: string | undefined,
  logsBloom: string,
  extraData: string,
  size: number,
  mixHash: string,
  timestamp: number,
  uncles: string[],
  baseFeePerGas: number | bigint | undefined,
}

export type BlockHeader = {
  number: number;
  nonce: string,
  gasUsed: number,
  gasLimit: number,
  transactionsRoot: string,
  receiptsRoot: string,
  stateRoot: string,
  transactions: string[] | undefined,
  hash: string,
  parentHash: string,
  difficulty: number,
  totalDifficulty: number,
  miner: string,
  sha3uncles: string | undefined,
  logsBloom: string,
  extraData: string,
  size: number,
  mixHash: string,
  timestamp: number,
  uncles: string[],
  baseFeePerGas: number | bigint | undefined,
}

export type SignedTransaction = {
  messageHash: string;
  v: string;
  r: string;
  s: string;
  rawTransaction: string;
  transactionHash: string;
}

export type GetTransactionResult = {
  success: boolean;
  error?: any;
  hash: string;
  transaction?: any;
}

export type GetTransactionReceiptResult = {
  success: boolean;
  error?: any;
  message?: string;
  hash: string;
  receipt?: any;
}

export type GetBlockResult = {
  success: boolean;
  error?: any;
  height: number | string;
  block?: any;
}

export type TypedGetBlockResult = {
  success: boolean;
  error?: any;
  height: number | string;
  block?: FullBlock;
}

export type GetTransactionCountResult = {
  success: boolean;
  error?: any;
  message?: string;
  transactionCount?: number;
}

export type GetBalanceResult = {
  success: boolean;
  error?: any;
  message?: string;
  balance?: string;
}

export type GetAddressResult = {
  success: boolean;
  error?: any;
  message: string;
  address?: string;
}
