### eth-backend-ts

Boilerplate code for backend Ethereum app.

This can be used for bots, monitoring wallets or contracts, data processing or basically anything that needs to stream / consume evm data.

The main idea is to provide a client with all the bells and whistles, that will keep the required data streams alive and healthy so that I can focus on implementation of the app's business logic.

As this repo is only meant to be a starting point for a project, it will be forked whenever I want to use it.

Clone this repo, then install dependencies and build with:

```typescript
npm run setup
```

You only really need the `connections` and `streams` sections populated in your `.env` file.

Set the `LOG_LEVEL_FOR_SERVICES` to `warn` or `error` to filter out the info logs coming from the boilerplate services and client.

Set `LOG_TO_FILE` to `true` to log to file for services.  The example in `src/main.ts` is using a separate logger that will still log to console.

Look at the examples for using the streams in `src/main.ts`

Then start the client using pm2 runtime with the command:

```typescript
npm run start:pm2
```

Or with node:

```typescript
npm start
```

Still a work in progress, but here is the roadmap:

 - stream block headers (DONE)
 - stream block transactions (DONE)
 - stream block logs (DONE)
 - stream block receipts (DONE)
 - stream ERC20 transfer events (DONE)
 - stream NFT transfer events
 - stream individual logs (DONE)
 - stream pending transactions
 - stream traces
 - stream contract creations
 - stream balance changes
 - stream storage updates
 - stream MEV transactions
 - stream gas price info
 - stream mempool gas price info
 - use PINO for logging (DONE)
 - log rotation for PINO
 - option to use API-based logging
 - option to use webhook-based alerts
 - use pm2 runtime to keep alive (DONE)
 - support containerization
 - dashboard
 - caching all data from the last 'N' blocks (DONE)
 - capturing / logging metrics (IN PROGRESS)
 - utilize bloxroute streams
 - delay streams by 'N' confirmations
 - handle reorgs
 - support multiple evm chains
 - adding filters to each stream
 - providing contract support with ABIs
 - support writing to datastores
 - make contract calls on each new block
 - simulate txns on each new block (eth-call + traceCall)
 - execution
 - simulate pending txns (eth-call + traceCall)
 - MEV support
 - compute proofs on each block