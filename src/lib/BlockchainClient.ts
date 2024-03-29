import StaticComponent from "./StaticComponent";
import {settings} from "../config/settings";
import {sleep} from "set-interval-non-concurrent";
import {BlockHeader, EventLog, Receipt, Transaction} from "../types/blockchain";
import Web3 from "web3";
import {BlockHeaderProcessor} from "../services/processors/BlockHeaderProcessor";
import Contract from "web3-eth-contract";
import {UniswapV2ERC20ABI} from "../abis/UniswapV2ERC20ABI";
import {MAINNET_USDC} from "../types/constants";
import {Client} from "../Client";
import BlockHeaderCache from "../cache/BlockHeaderCache";
import BlockHeaderSubscription from "../services/subscriptions/BlockHeaderSubscription";
import LogSubscription from "../services/subscriptions/LogSubscription";

class BlockchainClient extends StaticComponent {
  static websocketUrl: string;
  static jsonRpcUrl: string;
  static httpClient: Web3;
  static websocketClient: Web3;
  static chainId: number;
  static blockNumber: number;
  static isHttpConnectionValid: boolean = false;
  static isWebsocketConnectionValid: boolean = false;
  static tokenContract: any;
  static highestBlockNumber: number = 0;
  static startBlockNumber: number = 0;


  static async initialize(): Promise<void> {
    this.log(`Initializing BlockchainClient - new`);
    //this.hour = (new Date()).getHours();
    this.websocketUrl = settings.websocketUrl;
    this.jsonRpcUrl = settings.jsonRpcUrl;
    this.chainId = settings.chainId;
    this.connectWeb3();
    await this.confirmChainId();
    await this.confirmHighestBlock();
    this.tokenContract = new Contract(UniswapV2ERC20ABI as any[], MAINNET_USDC);
    this.log(`BlockchainClient initialized`);
  }

  static connectWeb3(): void {
    this.log(`Establishing web3 connections`);
    this.connectHttpClient();
    this.connectWebsocketClient();
  }

  static connectHttpClient(): void {
    if(this.jsonRpcUrl) {
      this.log(`Connecting HTTP Client with endpoint: ${this.jsonRpcUrl}`);
      this.httpClient = new Web3(this.jsonRpcUrl);
    } else {
      this.log(`No JSON RPC URL provided`);
    }
  }

  static connectWebsocketClient(): void {
    this.log(`Connecting Websocket Client with endpoint: ${this.websocketUrl}`);
    //this.websocketClient = new Web3(this.websocketUrl);

    this.websocketClient = new Web3(new Web3.providers.WebsocketProvider(
      this.websocketUrl,
      settings.websocketProviderOptions
    ));
  }

  static async confirmChainId(): Promise<void> {
    this.log(`Confirming Chain ID`);
    await sleep(500);
    await this.confirmChainIdForHttp();
    await this.confirmChainIdForWebsocket();
  }

  static async confirmChainIdForHttp(): Promise<void> {
    try {
      this.isHttpConnectionValid = true;

      if(this.jsonRpcUrl) {
        this.log('Confirming Chain ID for HTTP Client');
        const chainId: number = await this.httpClient.eth.getChainId();

        if(chainId !== this.chainId) {
          this.isHttpConnectionValid = false;
          this.error(`Wrong chainId for HTTP Client connection - got ${chainId} but should be ${this.chainId}`);
        }
      }
    } catch(e: any) {
      this.isHttpConnectionValid = false;
      this.error(`Error encountered confirming chainId for HTTP Client`, e);
    }
  }

  static async confirmChainIdForWebsocket(): Promise<void> {
    try {
      this.isWebsocketConnectionValid = true;

      if(this.websocketUrl) {
        this.log(`Confirming Chain ID for Websocket Client`);
        const chainId: number = await this.websocketClient.eth.getChainId();

        if(chainId !== this.chainId) {
          this.isWebsocketConnectionValid = false;
          this.error(`Wrong chainId for Websocket Client connection - got ${chainId} but should be ${this.chainId}`);
        }
      } else {
        this.isWebsocketConnectionValid = false;
      }
    } catch(e: any) {
      this.isHttpConnectionValid = false;
      this.error(`Error encountered confirming chainId for Websocket Client`, e);
    }
  }

  static async confirmHighestBlock(): Promise<void> {
    if(this.isWebsocketConnectionValid) {
      this.log('Confirming blockchain height');
      this.blockNumber = await this.websocketClient.eth.getBlockNumber();
      this.log(`Current blockchain height: ${this.blockNumber}`);
      this.highestBlockNumber = this.blockNumber;
      this.startBlockNumber = this.blockNumber;
    } else {
      this.error(`Cannot confirm blockchain height - websocket connection not valid`);
    }
  }

  // ===================================================================================================================
  //
  //  RPC requests
  //
  // ===================================================================================================================

  static async getPastLogs(blockNumber: number): Promise<EventLog[] | undefined> {
    try {
      const logs = await (!!this.httpClient ? this.httpClient : this.websocketClient).eth.getPastLogs({
        fromBlock: blockNumber,
        toBlock: blockNumber,
      });

      return !!logs ? logs.map((o: any) => ({...o} as EventLog)) : undefined;
    } catch(e: any) {
      this.error(`Error getting past logs for block ${blockNumber}`, e);
      return undefined;
    }
  }

  static async getBlockTransactions(blockNumber: number): Promise<Transaction[] | undefined> {
    try {
      const block: any = await (!!this.httpClient ? this.httpClient : this.websocketClient).eth.getBlock(
        blockNumber,
        true,
      );

      return (!!block && !!block.transactions) ? block.transactions.map((o: any) => ({...o} as Transaction)) : undefined;
    } catch(e: any) {
      this.error(`Error getting transactions for block ${blockNumber}`, e);
      return undefined;
    }
  }

  static async getTransactionReceipt(hash: string): Promise<Receipt | undefined> {
    try {
      const receipt = await (!!this.httpClient ? this.httpClient : this.websocketClient)
        .eth
        .getTransactionReceipt(
          hash,
        );

      return !!receipt ? JSON.parse(JSON.stringify(receipt)) : undefined;
    } catch(e: any) {
      this.error(`Error getting receipt for ${hash}`, e);
      return undefined;
    }
  }

  static async getBlock(blockNumber: number, full: boolean): Promise<BlockHeader | undefined> {
    try {
      const block = full ? (await (!!this.httpClient ? this.httpClient : this.websocketClient)
        .eth
        .getBlock(
          blockNumber,
          true,
        )) : (await (!!this.httpClient ? this.httpClient : this.websocketClient)
        .eth
        .getBlock(
          blockNumber,
        ));

      return !!block ? JSON.parse(JSON.stringify(block)) : undefined;
    } catch(e: any) {
      this.error(`Error getting block for ${blockNumber}`, e);
      return undefined;
    }
  }

  static async ethCall(tx: any): Promise<string | undefined> {
    try {
      return await (!!this.httpClient ? this.httpClient : this.websocketClient).eth.call(tx);
    } catch(e: any) {
      this.error(`Error making eth_call`, e);
      return undefined;
    }
  }

  static decodeParameters(types: any[], encoded: string): any | undefined {
    try {
      return (!!this.httpClient ? this.httpClient : this.websocketClient).eth.abi.decodeParameters(types.slice(), encoded);
    } catch(e: any) {
      this.error(`Error while trying to decode ${encoded} with ${JSON.stringify(types)}`, e);
      return undefined;
    }
  }

  // ===================================================================================================================
  //
  //  tokens
  //
  // ===================================================================================================================

  static encodeGetName(): string {
    return this.tokenContract.methods.name().encodeABI();
  }

  static encodeGetSymbol(): string {
    return this.tokenContract.methods.symbol().encodeABI();
  }

  static encodeGetDecimals(): string {
    return this.tokenContract.methods.decimals().encodeABI();
  }

  // ===================================================================================================================
  //
  //  subscriptions
  //
  // ===================================================================================================================

  static start(): void {
    this.log(`Starting newBlockHeader subscription...`);
    // todo - confirm which subscriptions to start in settings

    if(
      settings.streamBlockHeaders
      || settings.streamBlockTransactions
      || settings.streamBlockLogs
      || settings.streamBlockReceipts
      || settings.streamBlockErc20Transfers
      || settings.streamBlockNftTransfers
    ) {
      BlockHeaderSubscription.subscribe();
    }

    if(
      settings.streamLogs
      || settings.streamErc20Transfers
      || settings.streamNftTransfers
    ) {
      LogSubscription.subscribe();
    }
  }
}

export default BlockchainClient;
