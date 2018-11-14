const SHA256 = require('crypto-js/sha256');

class Block {
  constructor({timestamp, lastHash, hash, data}) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
  }

  toString() {
    return `Block -
      Timestamp: ${this.timestamp}
      Last Hash: ${this.lastHash.substring(0, 10)}
      Hash: ${this.hash.substring(0, 10)}
      Data: ${this.data}`;
  }

  static genesis() {
    const args = {
      timestamp:'Genesis time',
      lastHash: '----',
      hash:'f1r57-h45h',
      data: []
    }
    return new this(args)
  }

  static mineBlock({lastBlock, data}) {
    const time = Date.now();
    const hashArgs = {
      timestamp: time,
      lastHash: lastBlock.hash,
      data: data
    }
    const args = {
      timestamp: time,
      lastHash: lastBlock.hash,
      hash: Block.hash(hashArgs),
      data: data
    }

    return new this(args)
  }

  static hash({timestamp, lastHash, data}) {
    return SHA256(`${timestamp}${lastHash}${data}`).toString();
  }

  static blockHash(block) {
    const { timestamp, lastHash, data } = block;
    const hashArgs = {
      timestamp: timestamp,
      lastHash: lastHash,
      data: data
    }
    return Block.hash(hashArgs);
  }
}

module.exports = Block;