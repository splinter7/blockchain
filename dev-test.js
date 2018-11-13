const Block = require('./block');

const args = {
  lastBlock: Block.genesis(),
  data: "foo"
}

const fooBlock = Block.mineBlock(args);
console.log(fooBlock.toString());
