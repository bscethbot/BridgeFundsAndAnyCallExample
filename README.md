Environments setup:
1. yarn || npm install


How to test?


1. Enter prvkey for your TESTNET account
2. Get some testnet matic at https://faucet.polygon.technology/
3. Get some A1 token for testing by (This swaps your matic to our A1 token used for testing the router)
"yarn hardhat run ./scripts/0swapMaticToA1token.js --network polygonmumbai"
4. Try cross chain swap with 
"yarn hardhat run ./scripts/bridgefundsRouterV7.js --network polygonmumbai"