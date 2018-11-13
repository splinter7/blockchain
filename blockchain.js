const Block = require('./block');

class Blockchain {
  constructor(){
    this.chain = [Block.genesis()];
  }

  addBlock({data}) {
    const args = {
      lastBlock: this.chain[this.chain.length-1],
      data, data
    }
    const block = Block.mineBlock(args);
    this.chain.push(block);

    return block;
  }
}

module.exports = Blockchain;