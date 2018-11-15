const SHA256 = require('crypto-js/sha256');
const {DIFFICULTY, MINE_RATE} = require("../config")
class Block {
  constructor({timestamp, lastHash, hash, data, nonce, difficulty}) {
    this.timestamp = timestamp;
    this.lastHash = lastHash;
    this.hash = hash;
    this.data = data;
    this.nonce = nonce;
    this.difficulty = difficulty || DIFFICULTY
  }

  toString() {
    return `Block -
      Timestamp: ${this.timestamp}
      Last Hash: ${this.lastHash.substring(0, 10)}
      Hash: ${this.hash.substring(0, 10)}
      Nonce: ${this.nonce}
      Difficulty: ${this.difficulty}
      Data: ${this.data}`;
  }

  static genesis() {
    const args = {
      timestamp:'Genesis time',
      lastHash: '----',
      hash:'f1r57-h45h',
      data: [],
      nonce: 0,
      difficulty: DIFFICULTY
    }
    return new this(args)
  }

  static mineBlock({lastBlock, data}) {
    let nonce = 0;
    let hash, timestamp, lastHash;
    let { difficulty } = lastBlock

    do{
      nonce += 1
      timestamp = Date.now();
      difficulty = Block.adjustDifficulty(lastBlock, timestamp);
      lastHash = lastBlock.hash;

      hash = Block.hash({ timestamp, lastHash, data, nonce, difficulty })
    } while(hash.substring(0, difficulty) !== '0'.repeat(difficulty))

    return new this({ timestamp, lastHash, data, nonce, difficulty, hash })
  }

  static adjustDifficulty(lastBlock, currentTime){
    let {difficulty} = lastBlock;
    difficulty = lastBlock.timestamp + MINE_RATE > currentTime ? difficulty+1 : difficulty-1;
    return difficulty
  }

  static hash({timestamp, lastHash, data, nonce, difficulty}) {
    return SHA256(`${timestamp}${lastHash}${data}${nonce}${difficulty}`).toString();
  }

  static blockHash(block) {
    const { timestamp, lastHash, data, nonce, difficulty } = block;
    return Block.hash({ timestamp, lastHash, data, nonce, difficulty });
  }
}

module.exports = Block;