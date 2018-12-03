const Transaction = require("../wallet/transaction");
const Wallet = require("../wallet");


class Miner {
  constructor(blockchain, transactionPool, wallet, p2pServer) {
    this.blockchain = blockchain;
    this.wallet = wallet;
    this.transactionPool = transactionPool;
    this.p2pServer = p2pServer
  }

  mine(){
    const validTransactions = this.transactionPool.validTransactions();
    // include a reward for the miner
    validTransactions.push(
      Transaction.rewardTransaction(this.wallet, Wallet.blockchainWallet())
    );
    // create a block consiting of a valid transaction
    const block = this.blockchain.addBlock(validTransactions);
    // synchronize chains in the peer-to-peer server
    this.p2pServer.syncChains();
    // broadcast and clear the transaction pools
    this.transactionPool.clear();
    this.p2pServer.broadcastClearTransactions();

    return block;
  }
}

module.exports = Miner