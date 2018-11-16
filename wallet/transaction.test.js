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
})
