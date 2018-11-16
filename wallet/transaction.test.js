const Transaction = require('./transaction')
const Wallet = require('./index')

describe("Transaction", () => {
  let transaction, wallet, recipient, amount;
  let ridiculusAmount = 5000000000000000000000;

  beforeEach(() => {
    wallet = new Wallet();
    amount = 50;
    recipient = 'r3c1p13nt';
    transaction = Transaction.newTransaction(wallet, recipient, amount);
  })

  it('outputs the `amount` subtracted from the wallet amount', () => {
    expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
      .toEqual(wallet.balance - amount);
  })

  it('outputs the `amount` added to the wallet amount', () => {
    expect(transaction.outputs.find(output => output.address === recipient).amount)
      .toEqual(amount);
  })

  it('inputs the balance of the wallet', () => {
    expect(transaction.input.amount).toEqual(wallet.balance)
  });

  it('validates a valid transaction', () => {
    expect(Transaction.verifyTransaction(transaction)).toBe(true)
  })

  it('invalidates a corrupt transaction', () => {
    transaction.outputs[0].amount = ridiculusAmount;
    expect(Transaction.verifyTransaction(transaction)).toBe(false)
  })

  describe('transacting an `amount` that exceeds the balance', () => {
    beforeEach(() => {
      wallet = new Wallet();
      amount = ridiculusAmount;
      recipient = 'r3c1p13nt';
      transaction = Transaction.newTransaction(wallet, recipient, amount);
    })

    it('does not create the transaction ', () => {
      expect(transaction).toEqual(undefined);
    })
  })

  describe('and updaing a transaction', () => {
    let nextAmount, nextRecipient;

    beforeEach(() => {
      nextAmount = 20;
      nextRecipient = 'n3xt-4ddr355';
      transaction = transaction.update(wallet, nextRecipient, nextAmount);
    })

    it(`subtracts the next amount from the sender's output`, () => {
      expect(transaction.outputs.find(output => output.address === wallet.publicKey).amount)
        .toEqual(wallet.balance - amount - nextAmount)
    })

    it('outputs an amount for the next recipient', () => {
      expect(transaction.outputs.find(output => output.address === nextRecipient).amount)
        .toEqual(nextAmount);
    })
  })
})
